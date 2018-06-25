{ createRenderer } = require 'vue-server-renderer'
{ shallow } = require 'vue-test-utils'

glob = require 'glob'
fs = require 'file-system'

Dagre = require('../lib/dagre.vue').default

glob
.sync("./__tests__/**/*.dagre")
.map (path)->
  describe path, ->
    test 'snapshot', ->
      value = fs.readFileSync path, 'utf8'
      wrapper = shallow Dagre,
        propsData: { value }
      createRenderer().renderToString wrapper.vm, (err, str)->
        if err
          throw new Error(err)
        expect(str).toMatchSnapshot()
