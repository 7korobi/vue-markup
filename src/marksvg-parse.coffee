{ syntax } = require './marksvg-regexp'

parse_base = (render, src)->
  parents = {}
  tokens = []

  parse(render, src)

parse = (render, src)->
  while src
    # console.log src
    if cap = syntax.newline.exec src
      [ all ] = cap
      src = src[all.length ..]
      # console.log "newline", cap
      render.newline()
      continue

    if cap = syntax.edges.exec src
      [ all, edges, v, $, $, $, $, $, label ] = cap
      src = src[all.length ..]
      # console.log "edges", cap
      edges = edges
      .split syntax._arrow_
      .map (s)-> s?.trim()

      for v, idx in edges by 6
        [ v, start, line, side, line2, end, w ] = edges[idx .. idx + 6]
        if line != line2
          render.error " #{edges[idx .. idx + 6].join("")} 線の前後が異なります。"
          break
        continue unless w
        [vm, v, vl] = render.dic v
        [wm, w, wl] = render.dic w
        { rects } = render.data
        if rects[v] &&  rects[w]
          headpos = side?[0] ? '>'
          tailpos = side?[1] ? '<'
          render.edge v, w, line, start, end, headpos, tailpos, label
        else
          render.error " #{edges[idx .. idx + 6].join("")} 要素が未定義です。"
      continue

    if cap = syntax.nodes.exec src
      [ all, nodes, label ] = cap
      src = src[all.length ..]
      # console.log "nodes", cap
      nodes = nodes
      .trim()
      .split syntax.pick_node
      vs =
        for $, idx in nodes by 4
          [$, x, y, v] = nodes[idx .. idx + 3]
          continue unless v
          [vm, v, vl] = render.dic v
          render[vm] v, vl, x, y
          v
      if label
        render.cluster vs, label
      continue

    if cap = syntax.error.exec src
      [ all ] = cap
      src = src[all.length ..]
      render.error all, "解釈できない文字列です。"
      continue


module.exports = parse_base
