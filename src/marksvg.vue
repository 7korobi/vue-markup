<template lang="pug">
article
  svg(:style="`max-width: 100%; width: ${root.width}px;`" :viewBox="view_box" :ref="'root'" v-on="movespace()")
    marker.edgePath#svg-marker-circle(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="5" refY="5" orient="auto")
      circle(cx="5" cy="5" r="4")
    marker.edgePath#svg-marker-arrow-start(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="3" refY="5" orient="auto")
      path.fill(d="M10,0 L0,5 L10,10 z")
    marker.edgePath#svg-marker-arrow-end(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="3" refY="5" orient="auto")
      path.fill(d="M0,0 L10,5 L0,10 z")
    marker.edgePath#svg-marker-cross(viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="5" refY="5" orient="0")
      path.path(d="M0,0 L10,10 M0,10 L10,0 z")
    g
      rect( v-for="(o, key) in graph.rects"  v-if="o" v-bind="o" v-on="draggable(key, o)")
      image(v-for="(o, key) in graph.images" v-if="o" v-bind="o" v-on="draggable(key, o)")
    g.edgePath
      path.path(v-for="(o, key) in graph.paths" fill="none" v-if="o" v-bind="o")
      rect(v-for="(o, key) in graph.labels"  v-if="o" v-bind="o" :ref="o.key")
      text(v-for="(o, key) in graph.texts" v-if="o" v-bind="o" :ref="o.key")
        | {{ o.label }}
    g(v-if="move.id")
      rect.move(v-bind="moved")
  .errors(v-if="graph.errors.length")
    .error(v-for="err in graph.errors") {{ err }}
</template>

<script lang="coffee">
# inspired by https://github.com/wakufactory/MarkDownDiagram

SVG = require "./marksvg-parse"

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
  curve = 50
  switch mark
    when '^','u'
      x += 0.5 * width 
      # y origin
      vx =  0
      vy = -curve
    when 'v','d'
      x += 0.5 * width
      y += 1.0 * height
      vx =  0
      vy =  curve
    when '<','l'
      # x origin
      y += 0.5 * height
      vx = -curve
      vy =  0
    when '>','r'
      x += 1.0 * width
      y += 0.5 * height
      vx =  curve
      vy =  0
  { x, y, vx, vy }

class SvgRenderer
  plain: ->
    @data =
      nodes:  {}
      paths:  {}
      rects:  {}
      texts:  {}
      labels: {}
      images: {}
      errors: []

  newline: ->
  error: (line)->
    @data.errors.push line

  href: (key)-> key
  dic: (v)-> ['box', v, v]

  node: (name, v)->
    @data.nodes[name] = @data.rects[v]

  label: (v, label, x, y)->
    return unless label

    # text
    key = "label-#{v}"
    label ?= "   "
    labelpos = "c"
    className = "pen"
    @data.texts[v] = { class: className, key, labelpos, label, x, y }

    # label
    # x, y, width, height は後で。
    key = "rect-label-#{v}"
    rx     =  5
    ry     =  5
    @data.labels[v] = { class: className, key, rx, ry } 


  edge: (v, w, line, start, end, headpos, tailpos, label)->
    { gap_width } = @options.style
    weight = line.length
    start = marker start
    end   = marker end
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

    vo = @data.rects[v]
    wo = @data.rects[w]
    vp = pos vo, headpos
    wp = pos wo, tailpos

    cvpx = vp.x + vp.vx
    cvpy = vp.y + vp.vy
    cwpx = wp.x + wp.vx
    cwpy = wp.y + wp.vy
    d  = "M #{ vp.x } #{ vp.y } C #{ cvpx } #{ cvpy } #{ cwpx } #{ cwpy } #{ wp.x } #{ wp.y }"

    # path
    @data.paths[vw] = { class: className, key, d, "marker-start": start, "marker-end": end }

    # x, y は中点
    x = parseInt 0.5 * (cvpx + cwpx)
    y = parseInt 0.5 * (cvpy + cwpy)
    @label vw, label, x, y

  auto_xy: (x, y)->
    return [parseInt(x), parseInt(y)] if x? && y?

    xs =
      for key, { x } of @data.rects
        x
    xs.push -120
    x  = Math.max ...xs
    x += 150
    y  = 30
    [x, y]

  box: (v, label, x, y)->
    { border_width } = @options.style

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
    y += 1.0 * height
    @label v, label, x, y

  icon: (v, label, x, y)->
    { border_width } = @options.style

    [x, y] = @auto_xy x, y
    width  =  90
    height = 130
    rx     =  10
    ry     =  10

    href = @href v
    className = 'icon'
    key = "image=#{v}"

    # image
    @data.images[v] = { class: className, key, href, width, height, x: x + border_width , y: y + border_width, rx, ry }

    width  += 2 * border_width
    height += 2 * border_width

    className = 'box'
    key = "rect=#{v}"

    # rect
    @data.rects[v] = { class: className, key, width, height, x, y, rx, ry }

    # x, y はボトム
    x += 0.5 * width
    y += 1.0 * height
    @label v, label, x, y

  cluster: (vs, label)->
    vos = vs.map (v)=> @data.rects[v]

    rx     = 10
    ry     = 10
    className = 'cluster'
    fill = 'none'
    key = "rect=#{label}"

    { x, y, width, height } = @cover vos

    # rect
    @data.rects[label] = { class: className, key, fill, width, height, x, y, rx, ry }

    # x, y はボトム
    x += 0.5 * width
    y += 1.0 * height
    @label label, label, x, y

  cover: (vos)->
    { border_width } = @options.style
    unless vos.length
      vos.push
        x: border_width
        y: border_width
        width:  90 + 2 * border_width
        height: 90 + 2 * border_width

    xmin = Math.min ...vos.map (o)-> o.x
    xmax = Math.max ...vos.map (o)-> o.x + o.width
    ymin = Math.min ...vos.map (o)-> o.y
    ymax = Math.max ...vos.map (o)-> o.y + o.height + 30
    width  = xmax - xmin + 2 * border_width
    height = ymax - ymin + 2 * border_width
    x = xmin - border_width
    y = ymin - border_width

    { x, y, width, height }

options =
  renderer: new SvgRenderer
  style:
    rect_label:
      height:      5
      width:      20
    border_width: 10
    gap_width:    20
options.renderer.options = options


parse_touch = (e)->
  { pageX, pageY } = e.changedTouches[0]
  { target } = e
  { pageX, pageY, target }

vm =
  name: 'MarkSVG'
  options: options

  props:
    edit:
      type: Boolean
      default: false

    value:
      type: String
      default: ""

    context: Object

  data: ->
    move =
      id: null
      x: 0
      y: 0
      px: 0
      py: 0
    moved =
      x: 0
      y: 0
      rx: 0
      ry: 0
      width: 0
      height: 0
    zoom = 1.0
    gdata = options.renderer.plain()
    tokens = []

    { zoom, move, moved, gdata, tokens }

  methods:
    move_xy: ->
      { x, y, dx, dy } = @move
      x = parseInt Math.max 0, x + dx
      y = parseInt Math.max 0, y + dy
      console.log { x, y }
      { x, y }

    movespace: ->
      move = ({ pageX, pageY, target })=>
        if @move.id
          { px, py } = @move
          @move.dx = @zoom * (pageX - px)
          @move.dy = @zoom * (pageY - py)
          @recalc()
      finish = ({ pageX, pageY, target })=>
        if @move.id
          { px, py } = @move
          @move.dx = @zoom * (pageX - px)
          @move.dy = @zoom * (pageY - py)
          @reparse @move.id

      cb =
        touchend: (e)=>
          finish parse_touch e
        touchleave: (e)=>
          finish parse_touch e
        touchmove: (e)=>
          move parse_touch e
        mouseup: finish
        mouseleave: finish
        mousemove: move
        
    draggable: (id)->
      start = ({ pageX, pageY, target })=>
        { x, y, rx, ry, width, height } = @gdata.rects[id]
        @moved = { x, y, rx, ry, width, height }
        @move = { id, x, y, px: pageX, py: pageY }

      cb =
        touchstart: (e)=>
          e.preventDefault()
          start parse_touch e
        mousedown: (e)=>
          e.preventDefault()
          start e
    
    recalc: ->
      return unless @edit
      Object.assign @moved, @move_xy()

    reparse: (id)->
      @move.id = null
      return unless @edit
      Object.assign @gdata.rects[id], @move_xy()
      @$emit 'input', SVG.stringify @tokens, @gdata

    nop: -> false

  computed:
    root: ->
      options.renderer.cover Object.values(@graph.rects)

    view_box: ->
      "#{@root.x} #{@root.y} #{@root.width} #{@root.height}"

    graph: ->
      @gdata = options.renderer.plain()
      @tokens = SVG.parse options.renderer, @value
      @$nextTick =>
        return unless @$refs.root?.getClientRects
        @zoom = @root.width / @$refs.root.getClientRects()[0].width
        for key of @gdata.texts
          tk =      'label-' + key
          lk = 'rect-label-' + key
          continue unless @$refs[tk]?[0]?.getClientRects

          { width, height, x, y }  = @$refs[tk][0].getBBox()
          { rect_label } = options.style
          width  += rect_label.width
          height += rect_label.height
          x -= 0.5 * rect_label.width
          y -= 0.5 * rect_label.height
          for key, val of { x, y, width, height }
            @$refs[lk][0].setAttribute key, val
      @gdata

export default vm
</script>
