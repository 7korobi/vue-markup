<template lang="pug">
no-ssr
  article
    svg(:style="`max-width: 100%; width: ${root.width}px;`" :viewBox="view_box")
      marker.edgePath#svg-marker-circle(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="2" refY="5" orient="auto")
        circle(cx="5" cy="5" r="4")
      marker.edgePath#svg-marker-arrow-start(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="3" refY="5" orient="auto")
        path.path(d="M10,0 L0,5 L10,10 z")
      marker.edgePath#svg-marker-arrow-end(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="3" refY="5" orient="auto")
        path.path(d="M0,0 L10,5 L0,10 z")
      marker.edgePath#svg-marker-cross(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="5" refY="5" orient="0")
        path.path(d="M0,0 L10,10 M0,10 L10,0 z")
      transition-group(tag="g" name="nodes")
        rect( v-for="o in node_rects"  v-if="o" v-bind="o")
        image(v-for="o in node_images" v-if="o" v-bind="o")
      transition-group.edgePath(tag="g" name="edges")
        path.path(v-for="o in edge_paths" fill="none" v-if="o" v-bind="o")
        rect.path(v-for="o in edge_rects" v-if="o" v-bind="o")
        text.messageText(v-for="o in edge_labels" v-if="o" v-bind="o")
          | {{ o.label }}
    .errors
      .error(v-for="err in graph.errors") {{ err }}
</template>

<style lang="stylus" scoped>

.nodes-move:not(.nodes-leave-active)
  > rect
  > image
    transition: x .5s, y .5s
.edges-move:not(.edges-leave-active)
  transition: d .5s

</style>

<script lang="coffee">
dagre = require "dagre"
parse = require "./dagre-parse"


marker = (key)->
  switch key
    when '<', '('
      'url(#svg-marker-arrow-start)'
    when '>', ')'
      'url(#svg-marker-arrow-end)'
    when 'O', 'o'
      'url(#svg-marker-circle)'
    when 'X', 'x'
      'url(#svg-marker-cross)'
    else
      null


class Renderer
  newline: ->
  error: (line)->
    @graph.errors.push line

  dic: (v)->
    { id: v, name: v }

  node: (v, label)->
    chr = @dic v
    console.log chr
    if chr?.face
      { id, name } = chr.face
      o = @graph.node id
      unless o
        @icon id, label or name
      id
    else
      o = @graph.node v
      unless o
        @box v, label
      v

  edge: (v, w, line, start, end, label)->
    weight = line.length
    start = marker start
    end   = marker end
    line =
      switch line[0]
        when '='
          'wide'
        when '-'
          'solid'
        when '.'
          'dotted'
        else
          'hide'

    label ?= "   "
    @graph.setEdge v, w,
      key: [v,w].join()
      "marker-start": start
      "marker-end": end
      minlen: 1
      weight: weight
      class: line
      label: label
      labelpos: 'c'
      width:  25 * label.length + edge_label_width
      height: 30
      rx:      5
      ry:      5

  box: (v, label)->
    @graph.setNode v,
      label: label
      class: 'box'
      width:   90
      height:  90
      rx:      10
      ry:      10

  icon: (v, label)->
    @graph.setNode v,
      label: label
      class: 'icon'
      width:   90 + border_width
      height: 130 + border_width
      rx:      10
      ry:      10
  
  cluster: (v, w, label)->
    @graph.setNode w,
      key: w
      label: label
      class: 'cluster'
    @graph.setParent v, w

edge_label_width = 20
border_width   = 10

init = ->
  g = new dagre.graphlib.Graph
    directed:    true
    compound:    true
    multigraph: false
  g.setGraph
    # acyclicer: 'greedy'
    # ranker: 'network-simplex'
    # ranker: 'tight-tree'
    ranker: 'longest-path'
    rankdir: 'RL' # TB / BT / LR / RL
    nodesep: 10
    ranksep: 10
    edgesep:  0
    marginx:  3
    marginy:  3

options =
  renderer: new Renderer

vm =
  name: 'Dagre'
  options: options

  props: ["value"]
  methods:
    path_d: (list)->
      'M' + list
      .map ({x,y})-> "#{x},#{y}"
      # .join('T') # CurveTo Cx1,y1 x2,y2 x,y Sx2y2 x,y Qx1,y1, x,y Tx,y
      .join('L') # LineTo Lx,y Hx Vy

  computed:
    root: ->
      @graph.graph()
    
    edge_paths: ->
      for key in @graph.edges()
        o = @graph.edge key
        continue unless o?.points
        Object.assign {}, o,
          key: "path-" + o.key
          d: @path_d o.points
          points: undefined

    edge_rects: ->
      for key in @graph.edges()
        o = @graph.edge key
        continue unless o?.label?.trim()
        Object.assign {}, o,
          key: "labelrect-" + o.key
          width: o.width - edge_label_width
          x: o.x - o.width  * 0.5 + edge_label_width * 0.5
          y: o.y - o.height * 0.7
          points: undefined

    edge_labels: ->
      for key in @graph.edges()
        o = @graph.edge key
        continue unless o?.label

        Object.assign {}, o,
          key: "text-" + o.key
          label: o.label
          points: undefined

    node_images: ->
      for key in @graph.nodes()
        o = @graph.node key
        unless 'icon' == o.class
          continue
        key: "image-" + key
        x: o.x - o.width  * 0.5 + border_width * 0.5
        y: o.y - o.height * 0.5 + border_width * 0.5
        width:  o.width  - border_width
        height: o.height - border_width
        href: href key

    node_rects: ->
      for key in @graph.nodes()
        o = @graph.node key
        continue unless o

        key: "rect-" + key
        rx: o.rx
        ry: o.ry
        x: o.x - o.width  / 2
        y: o.y - o.height / 2
        width:  o.width
        height: o.height

    view_box: ->
      "0 0 #{@root.width} #{@root.height}"

    graph: ->
      g = init()
      options.renderer.options = options
      options.renderer.graph = g
      options.renderer.graph.errors = []
      parse options.renderer, @value
      dagre.layout options.renderer.graph
      g

module.exports = vm
module.exports.default = vm
</script>
