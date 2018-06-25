<script lang="coffee">
marked = require './marked'

itself = (o)-> o

class Renderer
  constructor: (@options)->

  paragraph: itself
  text: itself
  html: itself

  code: (code, lang)->
    { m } = @options
    if lang
      lang = @options.langPrefix + lang
      m 'pre', {}, [
        m 'code', { class: lang }, code
      ]
    else
      m 'pre', {}, [
        m 'code', {}, code
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

  table: (header, body)->
    { m } = @options
    ret =
    m 'div',
      class: 'swipe'
    , [
      m 'table', {}, [
        m 'thead', {}, [header]
        m 'tbody', {}, body
      ]
    ]
    ret

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



options =
  renderer: new Renderer
  tag: 'article'
  ruby: true
  gfm: true
  tables: true
  indentCode: false
  taskLists: true
  breaks: true
  pedantic: false
  sanitize: true
  smartLists: true
  smartypants: true
  silent: true
  em: false

module.exports =
  props: ["value"]

  render: (m)->
    { value } = @
    if value
      options.m = m
      marked value, options
    else
      ''
</script>

<style lang="stylus" scoped>
</style>
