{ block, inline, noop } = require './marked-regexp'

###
# Helpers
###

escape = (html, is_encode)->
  r_encode =
    if is_encode
    then /&/g
    else /&(?!#?\w+;)/g
  html
  .replace(r_encode, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

unescape = (html)->
  # explicitly match decimal, hex, and named HTML entities
  html.replace /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, (_, n)->
    n = n.toLowerCase()
    switch
      when n == 'colon'
        ':'
      when n.charAt(0) == '#'
        String.fromCharCode(
          if n.charAt(1) == 'x'
            parseInt( n[2..], 16 )
          else
            n[1..] - 0
        )
      else
        ""

resolveUrl = (base, href)->
  key = ' ' + base
  if ! baseUrls[key]
    # we can ignore everything in base after the last slash of its path component,
    # but we might need to add _that_
    # https://tools.ietf.org/html/rfc3986#section-3
    if /^[^:]+:\/*[^/]*$/.test(base)
      baseUrls[key] = base + '/'
    else
      baseUrls[key] = base.replace(/[^/]+$/, '') # rtrim not /
  base = baseUrls[key]

  switch
    when href[0..1] == '//'
      base.replace(/:[\s\S]*/, ':')
    when href.charAt(0) == '/'
      base.replace(/(:\/*[^/]*)[\s\S]*/, '$1')
    else
      base
baseUrls = {}
originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i

splitCells = (tableRow, max)->
  row = tableRow.replace /\|/g, (match, offset, str)->
    escaped = false
    curr = offset
    while --curr >= 0 and str[curr] == '\\'
      escaped = ! escaped
    if escaped
      '|'
    else
      ' |'
  cells = row.split(/ \|/)

  if cells.length > max
    cells.splice max
  else
    while cells.length < max
      cells.push ''

  for o, i in cells
    cells[i] = o.replace(/\\\|/g, '|').trim()
  cells

###
# Pedantic grammar
# not support
###

class Lexer
  @rules: block
  @lex: (src, options)->
    new Lexer(options).lex(src)

  constructor: (@options)->
    @tokens = []
    @tokens.notes = []
    @tokens.links = {}
    @tokens.abbrs = {}
    @rules = block.normal

    if @options.gfm
      @rules =
        if @options.tables
        then block.tables
        else block.gfm

    if ! @options.indentCode
      @rules.code = noop

  lex: (src)->
    src = src
    .replace /\r\n|\r/g, '\n'
    .replace /\t/g, '    '
    .replace /\u00a0/g, ' '
    .replace /\u2424/g, '\n'
    @token src, true

  token: (src, top)->
    while src
      # newline
      if cap = @rules.newline.exec src
        src = src[cap[0].length ..]
        if cap[0].length
          @tokens.push
            type: 'space'
            text: cap[0]

      # code
      if cap = @rules.code.exec src
        # console.log 'block code', cap
        src = src[cap[0].length ..]
        cap = cap[0].replace /^ {4}/gm, ''
        @tokens.push
          type: 'code'
          text: cap
        continue

      # fences (gfm)
      if cap = @rules.fences.exec src
        # console.log 'block fences', cap
        src = src[cap[0].length ..]
        mode = cap[1][0]
        switch mode
          when ':'
            @tokens.push
              type: 'container_start'
              lang: cap[2]
            @token cap[3], false
            @tokens.push
              type: 'container_end'
              lang: cap[2]
          else
            @tokens.push
              type: 'code'
              lang: cap[2]
              text: cap[3] or ''
        continue

      # heading
      if cap = @rules.heading.exec src
        # console.log 'block heading', cap
        src = src[cap[0].length ..]
        @tokens.push
          type: 'heading'
          depth: cap[1].length
          text: cap[2]
        continue

      # table no leading pipe (gfm)
      if cap = @rules.table.exec src
        src = src[cap[0].length ..]
        trim = /^\|? *|\ *\|? *$/g

        header = splitCells cap[1].replace(trim, '')
        align = cap[2].replace(trim, '').split(/ *\| */)
        cells = cap[5]?.replace(/\n$/, '').split('\n').map((o)=> o.replace(trim, '') ) ? []

        while header.length && ! header[header.length - 1].trim()
          header.pop()

        item = { type: 'table', header, align, cells, top }
        for o, i in align
          align[i] =
            if      /^ *-+: *$/.test o  then 'right'
            else if /^ *:-+: *$/.test o then 'center'
            else if /^ *:-+ *$/.test o  then 'left'
            else                              null
        for o, i in item.cells
          cells[i] = splitCells o, item.align.length
        @tokens.push item
        continue

      # hr
      if cap = @rules.hr.exec src
        # console.log 'block hr', cap
        src = src[cap[0].length ..]
        @tokens.push type: 'hr'
        continue

      # blockquote
      if cap = @rules.blockquote.exec src
        src = src[cap[0].length ..]
        @tokens.push
          type: 'blockquote_start'
          mode: '>'
        cap = cap[0]
        .replace /^ *> ?/gm, ''
        .replace /\n$/, ''
        # Pass `top` to keep the current
        # "toplevel" state. This is exactly
        # how markdown.pl works.
        @token cap, false
        @tokens.push
          type: 'blockquote_end'
        continue

      # list
      if cap = @rules.list.exec src
        # console.log 'block list', cap
        src = src[cap[0].length ..]
        bull = cap[2]
        is_ordered = "." == bull.slice(-1)
        @tokens.push
          type: 'list_start'
          ordered: is_ordered
          start:
            if is_ordered
            then  +bull
            else  ''
        # Get each top-level item.
        cap = cap[0].match(@rules.item)
        next = false

        l = cap.length
        i = 0
        while i < l
          item = cap[i]
          # Remove the list item's bullet
          # so it is seen as the next token.
          space = item.length
          item = item.replace @rules.with_bullet, ''

          # Outdent whatever the
          # list item contains. Hacky.
          if ~item.indexOf('\n ')
            space -= item.length
            item = item.replace(///^\ {1,#{ space }}///gm, '')

          # Determine whether the next list item belongs here.
          # Backpedal if it does not belong in this list.
          if @options.smartLists and i != l - 1
            b = block.bullet.exec(cap[i + 1])[0]
            if bull != b and !(bull.length > 1 and b.length > 1)
              src = cap[i + 1 ..].join('\n') + src
              i = l - 1

          # Determine whether item is loose or not.
          # Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          # for discount behavior.
          loose = next or /\n\n(?!\s*$)/.test(item)
          if i != l - 1
            next = item.charAt(item.length - 1) == '\n'
            if !loose
              loose = next

          # Check for task list items
          checkbox = @rules.checkbox.exec item
          checked =
            if checkbox
              item = item.replace @rules.checkbox, ''
              checkbox[1] != ' '

          type = if loose then 'loose_item_start' else 'list_item_start'
          @tokens.push { checked, type, task: checked? }

          # Recurse.
          @token item, false
          @tokens.push type: 'list_item_end'
          i++
        @tokens.push type: 'list_end'
        continue

      # html
      if cap = @rules.html.exec src
        src = src[cap[0].length ..]
        @tokens.push
          type:
            if @options.sanitize
            then 'paragraph'
            else 'html'
          pre: !@options.sanitizer and cap[1] in ['pre', 'script', 'style']
          text: cap[0]
        continue

      # abbr
      if cap = @rules.abbr.exec src
        # console.log 'abbr', cap
        src = src[cap[0].length ..]
        tag = cap[1]
        @tokens.abbrs[tag] ||=
          title: cap[2]
        @tokens.abbrs_reg = inline.words Object.keys @tokens.abbrs
        continue

      # def
      if top and cap = @rules.def.exec src
        # console.log 'def', cap
        src = src[cap[0].length ..]
        if cap[3]
          cap[3] = cap[3][1...-1]
        tag = cap[1].toLowerCase()
        @tokens.links[tag] ||=
          href:  cap[2]
          title: cap[3]
        continue

      # lheading
      if cap = @rules.lheading.exec src
        src = src[cap[0].length ..]
        @tokens.push
          type: 'heading'
          depth:
            if cap[2] == '='
            then 1
            else 2
          text: cap[1]
        continue
 
      # top-level paragraph
      if top and cap = @rules.paragraph.exec src
        src = src[cap[0].length ..]
        @tokens.push
          type: 'paragraph'
          text: cap[0]
        continue

      # text
      if cap = @rules.text.exec src
        # Top-level should never reach here.
        src = src[cap[0].length ..]
        @tokens.push
          type: 'text'
          text: cap[0]
          top: top
        continue

      if src
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
    @tokens


###
# Inline Lexer & Compiler
###
class InlineLexer
  ###
  # Expose Inline Rules
  ###
  @rules: inline
  @output: (src, options)->
    new InlineLexer(options, options).output src

  @escapes: (text)->
    text?.replace(InlineLexer.rules._escapes, '$1') or text

  constructor: ({ @notes, @links, @abbrs, @abbrs_reg }, options)->
    @options = options
    @rules = inline.normal
    @renderer = @options.renderer
    @renderer.options = @options
    if !@notes
      throw new Error('Tokens array requires a `notes` property.')
    if !@links
      throw new Error('Tokens array requires a `links` property.')

    if @options.gfm
      if @options.breaks
        @rules = inline.breaks
      else
        @rules = inline.gfm

    if ! @options.cite
      @rules.cite = noop

    if ! @options.context
      @rules.cite = noop

    if ! @options.em
      @rules.em = noop

  output: (src)->
    out = []
    out.plain = ""
    while src
      # escape
      if cap = @rules.escape.exec src
        # console.log 'escape', cap
        src = src[cap[0].length ..]
        text = cap[1]
        out.push text
        out.plain += text
        continue

      # cite
      if cap = @rules.cite.exec src
        # console.log 'cite', cap
        src = src[cap[0].length ..]
        text = cap[0]

        cite1 = cap[1][1...].split("-")
        size1 = cite1.length
        chat_idx1 = cite1.pop()
        phase_idx1 = cite1.pop()
        part_idx = cite1.pop()
        cite1 = [ undefined, undefined, part_idx, phase_idx1, chat_idx1]

        if cap[2]
          cite2 = cap[2][1...].split("-")
          size2 = cite2.length
          chat_idx2 = cite2.pop()
          phase_idx2 = cite2.pop()
          phase_idx2 ?= phase_idx1
          cite2 = [ undefined, undefined, part_idx, phase_idx2, chat_idx2]

        if 2 <= size1 <= 3
          if ! cite2 || 1 <= size2 <= 2
            out.push @renderer.cite text, cite1, cite2
            out.plain += text
            continue
        out.push @renderer.text text
        out.plain += text
        continue
        

      # autolink
      if cap = @rules.autolink.exec src
        # console.log 'autolink', cap
        src = src[cap[0].length ..]
        if cap[2] == '@'
          text = cap[1]
          href = 'mailto:' + text
        else
          text = cap[1]
          href = text
        out.push @outputLargeBrackets { text }, { href }
        out.plain += text
        continue

      # url (gfm)
      if !@inLink and (cap = @rules.url.exec src)
        # console.log 'url (gfm)', cap
        cap[0] = @rules._backpedal.exec(cap[0])[0]
        src = src[cap[0].length ..]
        if cap[2] == '@'
          text = cap[0]
          href = 'mailto:' + text
        else
          text = cap[0]
          if cap[1] == 'www.'
            href = 'http://' + text
          else
            href = text
        out.push @outputLargeBrackets { text }, { href }
        out.plain += text
        continue

      # strong
      if cap = @rules.strong.exec src
        # console.log 'strong', cap
        src = src[cap[0].length ..]
        method = 
          switch cap[0][1]
            when '_', '*'
              'strong'
            when '-'
              # strikeout (markdown-it)
              'strikeout'
            when ':'
              # span (markdown-it)
              'span'
            when '+'
              # ins (markdown-it)
              'ins'
            when '['
              # kbd (markdown-it)
              'kbd'
            when '~'
              # del (gfm)
              'del'
            when '='
              # Mark (markdown preview enhanced extended syntax)
              'mark'
        text = @output cap[0][2...-2]
        out.push @renderer[method] text
        out.plain += text.plain
        continue

      # tag
      if cap = @rules.tag.exec src
        # console.log 'tag', cap
        if !@inLink and /^<a /i.test(cap[0])
          @inLink = true
        else if @inLink and /^<\/a>/i.test(cap[0])
          @inLink = false
        src = src[cap[0].length ..]
        text = cap[0]
        out.plain += text
        out.push (
          if @options.sanitize
            if @options.sanitizer
            then @options.sanitizer text
            else text
          else
            text
        )
        continue

      # link
      if cap = @rules.link.exec src
        # console.log 'link', cap
        src = src[cap[0].length ..]
        mark = cap[0].charAt(0)
        if mark == '!'
          text = cap[1]
        else
          @inLink = true
          text = @output cap[1]
          @inLink = false

        href = InlineLexer.escapes cap[2].trim().replace /^<([\s\S]*)>$/, '$1'
        title = InlineLexer.escapes cap[3]?.slice(1, -1) or ''

        out.push @outputLargeBrackets { mark, text }, { href, title }
        out.plain += text.plain
        continue

      # reflink, nolink
      if (cap = @rules.reflink.exec src) or (cap = @rules.nolink.exec src)
        # console.log 'ref|no link', cap
        src = src[cap[0].length ..]
        mark = cap[0].charAt(0)
        link = (cap[2] or cap[1]).replace(/\s+/g, ' ')
        link = @links[link.toLowerCase()]
        unless link?.href
          out.push mark
          out.plain += mark
          src = cap[0][1 .. ] + src
          continue
        @inLink = true
        text = @output cap[1]
        @inLink = false
        out.push @outputLargeBrackets { mark, text }, link
        out.plain += text.plain
        continue

      # note
      if cap = @rules.note.exec src
        # console.log 'note', cap
        src = src[cap[0].length ..]
        text = @output cap[1]

        @notes.push o = { text }
        o.href = '#' + num = @notes.length
        out.push @renderer.note num, text, text.plain
        out.plain += text.plain
        continue

      # br
      if cap = @rules.br.exec src
        # console.log 'br', cap
        src = src[cap[0].length ..]
        out.push @renderer.br()
        out.plain += "\n"
        continue

      # em
      if cap = @rules.em.exec src
        # console.log 'em', cap
        src = src[cap[0].length ..]
        text = cap[6] or cap[5] or cap[4] or cap[3] or cap[2] or cap[1]
        text = @output text, cap[0][0]
        out.push @renderer.em text
        out.plain += text.plain
        continue

      # sup, sub
      if cap = @rules.supsub.exec src
        # console.log 'supsub', cap
        src = src[cap[0].length ..]
        method = 
          switch cap[0][0]
            when '^'
              # sup (markdown-it)
              'sup'
            when '~'
              # sub (markdown-it)
              'sub'

        text = @output cap[0][1...-1]
        out.push @renderer[method] text, text.plain
        out.plain += text.plain
        continue

      # code
      if cap = @rules.code.exec src
        # console.log 'code', cap
        src = src[cap[0].length ..]
        out.push @renderer.codespan cap[2], true
        out.plain += cap[2]
        continue

      # mdi
      if cap = @rules.mdi.exec src
        # console.log 'mdi', cap
        src = src[cap[0].length ..]
        out.push @renderer.mdi cap[1]
        out.plain += "@"
        continue

      # text
      if cap = @rules.text.exec src
        # console.log 'text', cap
        src = src[cap[0].length ..]
        text = cap[0]
        out.plain += text
        if @abbrs_reg
          for s in text.split @abbrs_reg
            o = @abbrs[s]
            text = @smartypants s
            if o
              out.push @renderer.abbr text, o.title
            else
              out.push @renderer.text text
        else
          out.push @renderer.text text
        continue

      if src
        throw new Error 'Infinite loop on byte: ' + src.charCodeAt(0)
    out

  outputLargeBrackets: ({ mark, text }, { href = '', title = '' })->
    if @options.sanitize
      try
        prot =
          decodeURIComponent unescape href
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      catch e
        return text
      if prot.indexOf('javascript:') == 0 or prot.indexOf('vbscript:') == 0 or prot.indexOf('data:') == 0
        return text

    if @options.baseUrl && ! originIndependentUrl.test(href)
      base = resolveUrl @options.baseUrl, href
    url = @renderer.url href, base
    switch mark
      when '!'
        @renderer.image url, title, text
      else
        @renderer.link url, title, text

  smartypants: (text)->
    if !@options.smartypants
      return text
    text
    # markdown-it replacements
    .replace /\+\-/g, '\u00B1'
    # markdown-it replacements
    .replace /\+\-/g, '\u00B1'
    # em-dashes
    .replace /---/g, '\u2014'
    # en-dashes
    .replace /--/g, '\u2013'
    # opening singles
    .replace /(^|[-\u2014/(\[{"\s])'/g, '$1\u2018'
    # closing singles & apostrophes
    .replace /'/g, '\u2019'
    # opening doubles
    .replace /(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c'
    # closing doubles
    .replace /"/g, '\u201d'
    # ellipses
    .replace /\.{3}/g, '\u2026'

# Parsing & Compiling
class Parser
  @parse = (src, options, renderer)->
    new Parser(options, renderer).parse src

  constructor: (@options)->
    @tokens = []
    @token = null
    { @renderer } = @options

  parse: (src)->
    { m } = @options
    @inline = new InlineLexer src, @options
    @tokens = src.reverse()
    out = []
    while @next()
      out.push @tok()
    if src.notes.length
      out.push @renderer.hr()
      notes = []
      for { text } in src.notes
        notes.push @renderer.listitem text 
      out.push @renderer.list notes, true, 1

    tag = @options.tag
    if tag
      m tag, {}, out
    else
      out.join("")

  next: ->
    @token = @tokens.pop()

  peek: ->
    @tokens[@tokens.length - 1] or 0

  parseText: ->
    body = @token.text
    while @peek().type == 'text'
      body += @next().text
    @inline.output body

  ###
  # Parse Current Token
  ###

  tok: ->
    switch @token.type
      when 'space'
        @token.text

      when 'hr'
        @renderer.hr()

      when 'heading'
        text = @inline.output(@token.text)
        @renderer.heading(
          text,
          @token.depth,
          text.plain
        )

      when 'code'
        @renderer.code(@token.text, @token.lang, @token.escaped)

      when 'table'
        tr = (header, args)=>
          cell = []
          for str, i in args
            cell.push @renderer.tablecell @inline.output(str), { header, align: @token.align[i] }
          if cell.length
            @renderer.tablerow(cell)
          else
            []

        header = tr true, @token.header
        body = []
        for row, i in @token.cells
          body.push tr false, row
        @renderer.table(header, body, top)

      when 'container_start'
        { lang } = @token
        body = []
        while @next().type != 'container_end'
          body.push @tok()
        @renderer.container(body, lang)

      when 'blockquote_start'
        { mode } = @token
        body = []
        while @next().type != 'blockquote_end'
          body.push @tok()
        @renderer.blockquote(body, mode)

      when 'list_start'
        { ordered, start } = @token
        body = []
        tasklist = false
        while @next().type != 'list_end'
          if @token.checked?
            taskList = true
          body.push @tok()
        @renderer.list(body, ordered, start, taskList)

      when 'list_item_start'
        body = []
        { checked } = @token
        while @next().type != 'list_item_end'
          if @token.type == 'text'
          then body = [ ...body, ...@parseText() ]
          else body.push @tok()
        @renderer.listitem(body, checked)

      when 'loose_item_start'
        body = []
        { checked } = @token
        while @next().type != 'list_item_end'
          body.push @tok()
        @renderer.listitem(body, checked)

      when 'html'
        html =
          if ! @token.pre
            @inline.output(@token.text)
          else
            @token.text
        @renderer.html(html)

      when 'paragraph'
        @renderer.paragraph @inline.output(@token.text), true

      when 'text'
        @renderer.paragraph @parseText(), @token.top

# Marked
marked = (src, opt)->
  # throw error in case of non string input
  unless src
    throw new Error('marked(): input parameter is undefined or null')
  if typeof src != 'string'
    txt = Object.prototype.toString.call(src)
    throw new Error("marked(): input parameter is of type #{txt}, string expected")

  try
    opt.renderer.options = opt

    tokens = Lexer.lex(src, opt)
    return Parser.parse tokens, opt
  catch e
    { m } = opt
    e.message += '\nPlease report this to https://github.com/7korobi/vue-markup.'
    if opt.silent
      message = "#{e.message}"
      return m 'p', {}, [
        "An error occured:",
        m 'pre', {}, message
      ]
    throw e


# Options
marked.defaults = {}

# Expose

marked.Parser = Parser
marked.parser = Parser.parse

marked.Lexer = Lexer
marked.lexer = Lexer.lex

marked.InlineLexer = InlineLexer
marked.inlineLexer = InlineLexer.output

marked.parse = marked

module.exports = marked
