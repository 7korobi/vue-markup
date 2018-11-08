<script lang="coffee">
_ = require 'lodash'
marked = require './marked-parse'
Dagre = require('./dagre.vue').default

itself = (o)-> o

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
        m Dagre, 
          attrs:
            value: code
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
        m "a",
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

  cite: (text, cite, end)->
    { m } = @options
    if cite
      m 'q',
        attrs: { cite, end }
      , text
    else
      text

  cite_exist: (cite)->
    true

options =
  renderer: new MarkedRenderer
  tag: 'article'
  langPrefix: 'language-' 
  ruby: true
  cite: true
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

vm =
  name: "Marked"
  options: options
  props: ["value", "context"]

  render: (m)->
    { value, context } = @
    if value
      options.m = m
      options.context = context
      options.renderer.options = options
      marked value, options
    else
      ''

export default vm
</script>
