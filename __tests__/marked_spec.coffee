{ createRenderer } = require 'vue-server-renderer'
{ shallow } = require 'vue-test-utils'
glob = require 'glob'
fs = require 'fs'

Marked = require '../lib/marked.vue'
###
Object.assign Marked.options,
  indentCode: true
  em: true
Object.assign Marked.options.renderer,
  paragraph: (text)->
    { m } = @options
    m 'p', {}, text
###

glob
.sync("./__tests__/**/*.md")
.map (path)->
  describe path, ->
    test 'snapshot', ->
      value = fs.readFileSync path, 'utf8'
      wrapper = shallow Marked.default,
        propsData: { value }
      createRenderer().renderToString wrapper.vm, (err, str)->
        if err
          throw new Error(err)
        expect(str).toMatchSnapshot()
