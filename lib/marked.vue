<style lang="stylus" scoped>
</style>
<script lang="coffee">
marked = require './marked-parse'

options =
  tag: 'article'
  langPrefix: 'lang-'
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

vm =
  name: "Marked"
  options: options
  props: ["value"]

  render: (m)->
    { value } = @
    if value
      options.m = m
      options.renderer.options = options
      marked value, options
    else
      ''

module.exports = vm
module.exports.default = vm
</script>
