Marked = require("./marked.vue").default
Dagre = require("./dagre.vue").default

itself = (o)-> o

marker = (key)->
  switch key
    when '<', '('
      'url(#svg-marker-arrow-start)'
    when '>', ')'
      'url(#svg-marker-arrow-end)'
    when 'O', 'o'
      'url(#svg-marker-circle)'
    when 'X', 'x'
      'url(#svg-marker-cross)'
    else
      null

class DagreRenderer
  newline: ->
  error: (line)->
    @graph.errors.push line

  href: (key)-> key
  dic: (v)-> ['box', v, v]

  is_edge: (v, w)->
    @graph.edge { v, w }

  is_node: (v)->
    @graph.node v

  edge: (v, w, line, start, end, label)->
    { edge_label_width } = @options.style
    weight = line.length
    start = marker start
    end   = marker end
    line =
      switch line[0]
        when '='
          'wide'
        when '-'
          'solid'
        when '.'
          'dotted'
        else
          'hide'

    label ?= "   "
    @graph.setEdge v, w,
      key: [v,w].join()
      "marker-start": start
      "marker-end": end
      minlen: 1
      weight: weight
      class: line
      label: label
      labelpos: 'c'
      width:  25 * label.length + edge_label_width
      height: 30
      rx:      5
      ry:      5

  box: (v, label)->
    { border_width } = @options.style
    @graph.setNode v,
      label: label
      class: 'box'
      width:   90 + border_width
      height:  90 + border_width
      rx:      10
      ry:      10

  icon: (v, label)->
    { border_width } = @options.style
    @graph.setNode v,
      label: label
      class: 'icon'
      width:   90 + border_width
      height: 130 + border_width
      rx:      10
      ry:      10
  
  cluster: (v, w, label)->
    @graph.setNode w,
      key: w
      label: label
      class: 'cluster'
    @graph.setParent v, w


class MarkedRenderer
  paragraph: itself
  text: itself
  html: itself

  code: (code, lang)->
    { m, langPrefix } = @options
    switch lang?.toLowerCase()
      when '', null, undefined
        m 'pre', {}, [
          m 'code', {}, code
        ]
      when 'svg', 'dagre'
        m Dagre, {}, code
      else
        lang = langPrefix + lang
        m 'pre', {}, [
          m 'code', { class: lang }, code
        ]

  blockquote: (quote)->
    { m } = @options
    m 'blockquote', {}, quote

  heading: (text, level, raw)->
    { m, headerIds, headerPrefix } = @options
    if headerIds
      id = headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-')
      m "h#{level}", { attrs: { id }}, text
    else
      m "h#{level}", {}, text

  hr: ->
    { m } = @options
    m 'hr'

  list: (body, ordered, start, taskList)->
    { m } = @options
    type =
      if ordered
      then "ol"
      else "ul"
    start = undefined unless ordered && start != 1
    m type,
      attrs: { start }
    , body

  listitem: (text, checked)->
    { m } = @options
    if checked?
      m 'li',
        attrs:
          class: 'task-list-item'
      , [
        m "input",
          attrs:
            type: 'checkbox'
            checked: checked
            class: 'task-list-item-checkbox'
        ...text
      ]
    else
      m 'li', {}, text

  table: (header, body, top)->
    { m } = @options
    m 'table', {}, [
      m 'thead', {}, [header]
      m 'tbody', {}, body
    ]

  tablerow: (content)->
    { m } = @options
    m 'tr', {}, content

  tablecell: (content, { header, align })->
    { m } = @options
    tag =
      if header
        'th'
      else
        'td'
    m tag,
      class: align?[0]
    , content

  # span level renderer
  em: (text)->
    { m } = @options
    m 'em', {}, text

  strong: (text)->
    { m } = @options
    m 'strong', {}, text

  codespan: (text)->
    { m } = @options
    m 'code', {}, text

  br: ->
    '\n'

  del: (text)->
    { m } = @options
    m 'del', {}, text

  note: (num, text, title)->
    { m } = @options
    m 'sup',
      attrs: { title, class: 'note' }
    , num

  link: (href, title, text)->
    { m } = @options
    [protocol, hostname] = href.split /// \:// | / | \? | \# ///g
    text  ||= protocol
    title ||= [protocol, hostname].join("\n")
    switch href
      when null, undefined, "", "#"
        m "q",
          attrs: { title }
        , text
      else
        m "b",
          attrs: { title, href, chk: 'confirm' }
        , text

  image: (src, title, alt)->
    unless title
      title = undefined
    { m } = @options
    m 'img',
      attrs: { src, alt, title }

  url: (href)->
    href

  # markdown-it
  container: (text, lang)->
    { m } = @options
    m 'p',
      attrs:
        class: lang
    , text

  strikeout: (text)->
    { m } = @options
    m 's', {}, text

  span: (text)->
    { m } = @options
    m 'span', {}, text

  ins: (text)->
    { m } = @options
    m 'ins', {}, text

  kbd: (text)->
    { m } = @options
    m 'kbd', {}, text

  mdi: (name)->
    { m } = @options
    m 'i',
      attrs:
        class: "mdi #{name}"

  abbr: (text, title)->
    { m } = @options
    m 'ruby', {}, [
      text
      m 'rp', {}, ["《"]
      m 'rt', {}, title
      m 'rp', {}, ["》"]
    ]

  mark: (text)->
    { m } = @options
    m 'abbr', {}, text

  sup: (text)->
    { m } = @options
    m 'sup', {}, text

  sub: (text)->
    { m } = @options
    m 'sub', {}, text

Dagre.options.renderer = new DagreRenderer
Marked.options.renderer = new MarkedRenderer

dic = { Marked, Dagre }
dic.default = dic
module.exports = dic
