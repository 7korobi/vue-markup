{ createRenderer } = require 'vue-server-renderer'
{ shallow } = require 'vue-test-utils'
glob = require 'glob'
fs = require 'file-system'

{ Marked } = require '../src/index'

Object.assign Marked.options,
  silent: false
  indentCode: true
  em: true
Object.assign Marked.options.renderer,
  paragraph: (text)->
    { m } = @options
    m 'p', {}, text

glob
.sync("./__tests__/**/*.md")
.map (path)->
  describe path, ->
    test 'snapshot', ->
      value = fs.readFileSync path, 'utf8'
      context =
        book_id: 'spec-1'
        part_id: 'spec-1-1'
      wrapper = shallow Marked,
        propsData: { value, context }
      createRenderer().renderToString wrapper.vm, (err, str)->
        if err
          throw new Error(err)
        expect(str).toMatchSnapshot()
