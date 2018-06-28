{ syntax } = require './dagre-regexp'

parse = (render, src)->
  parents = {}
  tokens = []

  last =
    v: ""
    depth: 0
  find_parent = (v, depth)->
    depth = depth.length
    if last.depth < depth
      parents[depth] = last
    last = { depth, v }
    parents[depth]?.v

  while src
    # console.log src
    if cap = syntax.newline.exec src
      [ all ] = cap
      src = src[all.length ..]
      # console.log "newline", cap
      render.newline()
      continue

    if cap = syntax.edges.exec src
      [ all, depth, edges, v, $, $, $, label ] = cap
      src = src[all.length ..]
      # console.log "edges", cap
      edges = edges
      .split syntax._arrow_
      .map (s)-> s?.trim()

      if v
        if find_parent "", depth
          render.error all
          continue
      else
        unless v = find_parent "", depth
          render.error all
          continue

      edges[0] = v
      for v, idx in edges by 4
        [ v, start, line, end, w ] = edges[idx .. idx + 4]
        if w
          [vm, v, vl] = render.dic v
          [wm, w, wl] = render.dic w
          render[vm] v, vl
          render.edge v, v, "", "", "", vl
          render[wm] w, wl
          render.edge w, w, "", "", "", wl
          render.edge v, w, line, start, end, label
      continue

    if cap = syntax.nodes.exec src
      [ all, depth, nodes, label ] = cap
      src = src[all.length ..]
      # console.log "nodes", cap
      nodes = nodes
      .trim()
      .split(/ +/)
      for v, idx in nodes
        [vm, v, vl] = render.dic v
        render[vm] v, label or vl
        if label
          render.edge v, v, "", "", "", label

        if parent = find_parent v, depth
          [_, parent, pl] = render.dic parent
          { label } = render.is_node parent
          if label
            render.cluster v, parent, label

      continue

    if cap = syntax.error.exec src
      [ all ] = cap
      src = src[all.length ..]
      render.error all, "解釈できない文字列です。"
      continue


module.exports = parse
