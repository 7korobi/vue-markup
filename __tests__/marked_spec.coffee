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

TurndownService = require 'turndown'
{ gfm } = require 'turndown-plugin-gfm'

to_md = new TurndownService
  bulletListMarker: '+'
to_md.use gfm
to_md.addRule 'confirm link',
  filter: ['b']
  replacement: (content, node, options)->
    console.warn(arguments)
    [href, title] = ["href","title"].map (key)-> node.getAttribute key

    if title
      """[#{content}](#{href} #{title})"""
    else
      """[#{content}](#{href})"""

###
こまけえことはいいんだよ = (str)->
  str
  .replace /\s/g,""
  .replace /<(\w+)><\/\1>/g,"" 
  .replace /\\\\`/g,'`' 
###

glob
.sync("./__tests__/**/*.md")
.map (path)->
  describe path, ->
    value = fs.readFileSync path, 'utf8'
    test 'snapshot', ->
      context =
        book_id: 'spec-1'
        part_id: 'spec-1-1'
      wrapper = shallow Marked,
        propsData: { value, context }
      html  = wrapper.html()
      expect( html ).toMatchSnapshot()

      ###
      value = to_md.turndown html
      wrapper2 = shallow Marked,
        propsData: { value, context }
      html2 = wrapper2.html()

      expect( こまけえことはいいんだよ html ).toEqual( こまけえことはいいんだよ html2 )
      ###
