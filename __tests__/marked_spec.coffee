glob = require 'glob'
fs = require 'fs'
Marked = require '../lib/marked.vue'

{ createRenderer } = require 'vue-server-renderer'
{ shallow } = require 'vue-test-utils'

list = glob.sync("./__tests__/**/*.md")
for path in list
  describe path, ->
    test 'snapshot', ->
      value = fs.readFileSync path, 'utf8'
      wrapper = shallow Marked.default,
        propsData: { value }
      createRenderer().renderToString wrapper.vm, (err, str)->
        if err
          throw new Error(err)
        expect(str).toMatchSnapshot()
