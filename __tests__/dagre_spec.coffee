glob = require 'glob'
fs = require 'fs'
Dagre = require '../lib/dagre.vue'

{ createRenderer } = require 'vue-server-renderer'
{ shallow } = require 'vue-test-utils'

glob
.sync("./__tests__/**/*.dagre")
.map (path)->
  describe path, ->
    test 'snapshot', ->
      value = fs.readFileSync path, 'utf8'
      wrapper = shallow Dagre.default,
        propsData: { value }
      createRenderer().renderToString wrapper.vm, (err, str)->
        if err
          throw new Error(err)
        expect(str).toMatchSnapshot()
