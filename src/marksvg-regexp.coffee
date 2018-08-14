regexp_join = (regex, ...names) ->
  { flags, source } = regex

  for name in names
    key = new RegExp name, 'g'
    val = syntax[name]
    val = val.source or val
    source = source.replace key, val
  new RegExp source, flags

syntax =
  edges: /^ *((_id_)?(?: *_arrow_ *_id_)+) *(?:_comment_)?(?:_eol_)/
  nodes: /^ *((?:(?:(?:(?:_xy_)?_id_)| |\n))+)(?:_comment_)?(?:_eol_)/
  cluster: /^ *=+ *(_id_) *(?:_comment_)?(?:_eol_)/
  newline: /^ *\n|^ +$/
  error: /^[^\n]*\n|[^\n]+$/

  pick_node: /(?:<(\d+),(\d+)>)?(_id_)/g

  _xy_: /<\d+,\d+>/
  _id_: /[^\s<>:]+/
  _arrow_: /(<|X|x|O|o)?(-|=|\.)+([udlrUDLRv^<>]{2,2})?(-|=|\.)+(>|X|x|O|o)?/
  _comment_: /: *(.*) */
  _eol_: / *(?:\n|$)/

syntax.edges     = regexp_join syntax.edges,           '_id_', '_arrow_', '_comment_', '_eol_'
syntax.nodes     = regexp_join syntax.nodes,   '_xy_', '_id_', '_arrow_', '_comment_', '_eol_'
syntax.cluster   = regexp_join syntax.cluster,         '_id_',            '_comment_', '_eol_'
syntax.pick_node = regexp_join syntax.pick_node,       '_id_'

module.exports = { syntax }
