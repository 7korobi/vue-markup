regexp_join = (regex, ...names) ->
  { flags, source } = regex

  for name in names
    key = new RegExp name, 'g'
    val = syntax[name]
    val = val.source or val
    source = source.replace key, val
  new RegExp source, flags

syntax =
  nodes: /^(?:_header_)? *((?:(?:_xy_)?_id__sep_)+)_eol_/
  edges: /^ *((_id_)?(?: *_arrow_ *_id_)+) *(?:_comment_)?_eol_/
  newline: /^ *\n|^ +$/
  error: /^[^\n]*\n|[^\n]+$/

  pick_node: /(?:<(\d+) (\d+)>)?(_id_)/g

  _xy_: /<\d+ \d+>/
  _id_: /[^\n\s<>#]+/
  _arrow_: /(<|X|x|O|o)?(-|=|\.)+([udlrUDLRv^<>]{2,2})?(-|=|\.)+(>|X|x|O|o)?/
  _header_: /#{1,3} *(.*) *\n/
  _comment_: /#{1,3} *(.*) */
  _sep_: / *\n? */
  _eol_: / *(?:\n|$)/

syntax.nodes     = regexp_join syntax.nodes,   '_xy_', '_id_', '_header_',    '_sep_', '_eol_'
syntax.edges     = regexp_join syntax.edges,           '_id_', '_arrow_', '_comment_', '_eol_'
syntax.pick_node = regexp_join syntax.pick_node,       '_id_'

module.exports = { syntax }
