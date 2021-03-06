{ shallow } = require 'vue-test-utils'

glob = require 'glob'
fs = require 'file-system'

{ Dagre } = require '../src/index'

glob
.sync("./__tests__/**/*.dagre")
.map (path)->
  describe path, ->
    test 'snapshot', ->
      value = fs.readFileSync path, 'utf8'
      context =
        book_id: 'spec-1'
        part_id: 'spec-1-1'
      wrapper = shallow Dagre,
        propsData: { value, context }
      expect(wrapper.html().replace /></g, ">\n<").toMatchSnapshot()
