regexp_join = (regex, ...names) ->
  { flags, source } = regex

  for name in names
    key = new RegExp name, 'g'
    val = syntax[name]
    val = val.source or val
    source = source.replace key, val
  new RegExp source, flags

syntax =
  edges: /^( *)((_node_)?(?: *_arrow_ *_node_)+) *(?:_comment_)?(?:_eol_)/
  nodes: /^( *)((?:_node_| )+)(?:_comment_)?(?:_eol_)/
  newline: /^ *\n|^ +$/

  error: /^[^\n]*\n|[^\n]+$/

  _node_: /[^\s:]+/
  _arrow_: /(<|X|x|O|o)?(-+|=+|\.+)(>|X|x|O|o)?/
  _comment_: /: *(.*) */
  _eol_: / *(?:\n|$)/

syntax.nodes = regexp_join syntax.nodes, '_node_', '_arrow_', '_comment_', '_eol_'
syntax.edges = regexp_join syntax.edges, '_node_', '_arrow_', '_comment_', '_eol_'


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
          v = render.node v
          w = render.node w
          console.log { v, w }
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
        render.node v, label
        if label
          render.edge v, v, "", "", "", label

        if parent = find_parent v, depth
          { label } = render.graph.node parent
          if label
            render.cluster v, parent, label

      continue

    if cap = syntax.error.exec src
      [ all ] = cap
      src = src[all.length ..]
      render.error all, "解釈できない文字列です。"
      continue


module.exports = parse
