<template lang="pug">
article
  svg(:style="`max-width: 100%; width: ${root.width}px;`" :viewBox="view_box")
    marker.edgePath#svg-marker-circle(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="5" refY="5" orient="auto")
      circle(cx="5" cy="5" r="4")
    marker.edgePath#svg-marker-arrow-start(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="3" refY="5" orient="auto")
      path.path(d="M10,0 L0,5 L10,10 z")
    marker.edgePath#svg-marker-arrow-end(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="3" refY="5" orient="auto")
      path.path(d="M0,0 L10,5 L0,10 z")
    marker.edgePath#svg-marker-cross(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="5" refY="5" orient="0")
      path.path(d="M0,0 L10,10 M0,10 L10,0 z")
    g
      rect( v-for="(o, key) in rects"  v-if="o" v-bind="o" @dragstart="start( $event, key )" @dragenter="nop" @dragover="nop" @drop="finish( $event, key )")
      image(v-for="(o, key) in images" v-if="o" v-bind="o")
    g
      path.path(v-for="(o, key) in paths" fill="none" v-if="o" v-bind="o")
      text.messageText(v-for="(o, key) in texts" v-if="o" v-bind="o")
        | {{ o.label }}
  .errors(v-if="graph.errors.length")
    .error(v-for="err in graph.errors") {{ err }}
</template>

<script lang="coffee">
# inspired by https://github.com/wakufactory/MarkDownDiagram

parse = require "./marksvg-parse"
syntax = require "./marksvg-regexp"

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

pos = ({ x, y, width, height }, mark)->
  switch mark
    when '^','u'
      x += 0.5 * width 
      # y origin
      vx =  0
      vy = -1
    when 'v','d'
      x += 0.5 * width
      y += 1.0 * height
      vx =  0
      vy =  1
    when '<','l'
      # x origin
      y += 0.5 * height
      vx = -1
      vy =  0
    when '>','r'
      x += 1.0 * width
      y += 0.5 * height
      vx =  1
      vy =  0
  { x, y, vx, vy }

class SvgRenderer
  plain: ->
    @data =
      paths:  {}
      rects:  {}
      texts:  {}
      images: {}
      errors: []

  newline: ->
  error: (line)->
    @data.errors.push line

  href: (key)-> key
  dic: (v)-> ['box', v, v]

  label: (v, label, x, y)->
    { label_width, label_height } = @options.style

    return unless label

    label ?= "   "
    labelpos = "c"
    width  = 25 * label.length + label_width
    height = label_height
    className = "text"
    rx     =  5
    ry     =  5
    key = "label-#{v}"

    # text
    @data.texts[v] = { class: className, key, labelpos, label, width, height, x, y, rx, ry }

  edge: (v, w, line, start, end, headpos, tailpos, label)->
    { gap_width } = @options.style
    weight = line.length
    markerStart = marker start
    markerEnd   = marker end
    className =
      switch line[0]
        when '='
          'wide'
        when '-'
          'solid'
        when '.'
          'dotted'
        else
          'hide'

    vw  = [v,w].join("+")
    key = "path=#{vw}"

    curve = 50
    vo = @data.rects[v]
    wo = @data.rects[w]
    vp = pos vo, headpos
    wp = pos wo, tailpos
    d  = "M #{ vp.x } #{ vp.y } C #{ vp.x + vp.vx * curve } #{ vp.y + vp.vy * curve } #{ wp.x + wp.vx * curve } #{ wp.y + wp.vy * curve } #{ wp.x } #{ wp.y }"

    # path
    @data.paths[vw] = { class: className, key, d, markerStart, markerEnd }

    # x, y は中点
    x = parseInt 0.5 * (vo.x + wo.x) + 0.25 * (vo.width  + wo.width)
    y = parseInt 0.5 * (vo.y + wo.y) + 0.25 * (vo.height + wo.height)
    if label
      @point label, x, y
    @label vw, label, x, y

  auto_xy: (x, y)->
    return [parseInt(x), parseInt(y)] if x? && y?

    xs =
      for key, { x } of @data.rects
        x
    xs.push -90
    x  = Math.max ...xs
    x += 100
    y  = 10
    [x, y]

  point: (v, x, y)->
    [x, y] = @auto_xy x, y
    width  = 0
    height = 0
    rx     = 0
    ry     = 0

    className = 'point'
    key = "rect=#{v}"

    # rect
    @data.rects[v] = { class: className, key, width, height, x, y, rx, ry }

  box: (v, label, x, y)->
    { border_width, label_height } = @options.style

    [x, y] = @auto_xy x, y
    width  = 90 + 2 * border_width
    height = 90 + 2 * border_width
    rx     = 10
    ry     = 10

    className = 'box'
    key = "rect=#{v}"

    # rect
    @data.rects[v] = { class: className, key, width, height, x, y, rx, ry }

    # x, y はボトム
    x += 0.5 * width
    y += 1.0 * height + label_height
    @label v, label, x, y

  icon: (v, label, x, y)->
    { border_width, label_height } = @options.style

    [x, y] = @auto_xy x, y
    width  =  90
    height = 130
    rx     =  10
    ry     =  10

    href = @href key
    className = 'icon'
    key = "image=#{v}"

    # image
    @data.images[v] = { class: className, key, href, width, height, x, y, rx, ry }

    width  += 2 * border_width
    height += 2 * border_width
    x -= border_width
    y -= border_width

    className = 'box'
    key = "rect=#{v}"

    # rect
    @data.rects[v] = { class: className, key, width, height, x, y, rx, ry }

    # x, y はボトム
    x += 0.5 * width
    y += 1.0 * height + label_height
    @label v, label, x, y

  cluster: (vs, label)->
    { label_height } = @options.style
    vos = vs.map (v)=> @data.rects[v]

    rx     = 10
    ry     = 10
    className = 'cluster'
    key = "rect=#{label}"

    { x, y, width, height } = @cover vos

    # rect
    @data.rects[label] = { class: className, key, width, height, x, y, rx, ry }

    # x, y はボトム
    x += 0.5 * width
    y += 1.0 * height + label_height
    @label label, label, x, y

  cover: (vos)->
    { border_width } = @options.style
    vos.push
      x: border_width
      y: border_width
      width:  90 + 2 * border_width
      height: 90 + 2 * border_width

    xmin = Math.min ...vos.map (o)-> o.x
    xmax = Math.max ...vos.map (o)-> o.x + o.width
    ymin = Math.min ...vos.map (o)-> o.y
    ymax = Math.max ...vos.map (o)-> o.y + o.height
    width  = xmax - xmin + 2 * border_width
    height = ymax - ymin + 2 * border_width
    x = xmin - border_width
    y = ymin - border_width

    { x, y, width, height }

options =
  renderer: new SvgRenderer
  style:
    label_width:  20
    label_height: 30
    border_width: 10
    gap_width: 20
options.renderer.options = options

vm =
  name: 'MarkSVG'
  options: options

  props: ["value", "context"]

  data: ->
    moving: ""
    start_x: 0
    start_y: 0
    data: {}

  methods:
    start: ({ @pageX, @pageY }, @moving )->

    drop: ({ pageX, pageY }, id)->
      return unless id == @moving
      x = pageX - @pageX
      y = pageY - @pageY
      @recalc id, x, y
    
    recalc: (v, x, y)->
      console.log { id, x, y }
      Object.assign @data.rects[v], { x, y }

      @$emit 'input', @value.replace syntax.pick_node, ( x, y, id )=>
        { x, y } = @data.rects[id]
        "<#{x},#{y}>#{id}"

    nop: -> false

  computed:
    root: ->
      options.renderer.cover Object.values(@rects)
    
    paths: ->
      @graph.paths

    rects: ->
      @graph.rects

    texts: ->
      @graph.texts

    images: ->
      @graph.images

    view_box: ->
      "#{@root.x} #{@root.y} #{@root.width} #{@root.height}"

    graph: ->
      @data = options.renderer.plain()
      parse options.renderer, @value
      @data

export default vm
</script>
