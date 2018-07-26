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

module.exports = { syntax }
