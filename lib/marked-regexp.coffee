edit = (regex, opt)->
  regex = regex.source or regex
  opt = opt or ''
  self = (name, val)->
    if name
      val = val.source or val
      val = val.replace(/(^|[^\\\[])\^/g, '$1')
      regex = regex.replace(name, val)
      self
    else
      new RegExp(regex, opt)

noop = ->
noop.exec = noop

###
# Block-Level Grammer
###
block =
  newline: /^ *\n+/
  code: /^( {4}[^\n]+\n*)+/
  fences: noop
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n|$)/
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n|$)/
  table: noop
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/
  list: /^( *)(bull)[\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull)\n*|\s*$)/
  html: ///
    ^\ {0,3}(?: # optional indentation
    <(script|pre|style)[\s>][\s\S]*?(?:</\1>[^\n]*\n+|$) # (1)
    |comment[^\n]*(\n+|$) # (2)
    |<\?[\s\S]*?\?>\n* # (3)
    |<![A-Z][\s\S]*?>\n* # (4)
    |<!\[CDATA\[[\s\S]*?\]\]>\n* # (5)
    |</?(tag)(?:\ +|\n|/?>)[\s\S]*?(?:\n{2,}|$) # (6)
    |<(?!script|pre|style)([a-z][\w-]*)(?:attribute)*?\ */?>(?=\h*\n)[\s\S]*?(?:\n{2,}|$) # (7) open tag
    |</(?!script|pre|style)[a-z][\w-]*\s*>(?=\h*\n)[\s\S]*?(?:\n{2,}|$) # (7) closing tag
    )
  ///
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n|$)/
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n|$)/
  checkbox: /^\[([ xX])\] +/
  paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/
  text: /^[^\n]+/
  abbr: noop

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
block.def = edit(block.def
)( 'label', block._label
)( 'title', block._title
)()

block.with_bullet = /^ *([*+-]|\d+\.) */
block.bullet = /(?:[*+-] |\d+\.)/
block.item = /^( *)(bull)[^\n]*(?:\n(?!\1bull)[^\n]*)*/
block.item = edit(block.item, 'gm'
)( /bull/g, block.bullet
)()

block.list = edit(block.list
)( /bull/g, block.bullet
)( 'hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n|$))'
)( 'def', '\\n+(?=' + block.def.source + ')'
)()

block._tag = ///
  address|article|aside|base|basefont|blockquote|body|caption
  |center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption
  |figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe
  |legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option
  |p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr
  |track|ul
///

block._comment = /<!--(?!-?>)[\s\S]*?-->/
block.html = edit(block.html, 'i'
)( 'comment', block._comment
)( 'tag', block._tag
)('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
)()

block.paragraph = edit(block.paragraph
)( 'hr', block.hr
)( 'heading', block.heading
)( 'lheading', block.lheading
)( 'tag', block._tag
)()

block.blockquote = edit(block.blockquote
)( 'paragraph', block.paragraph
)()

###
# Normal Block Grammar
###
block.normal = Object.assign {}, block

###
# GFM Block Grammar
###
block.gfm = Object.assign {}, block.normal,
  fences: /^ *(`{3,}|~{3,}|:{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n|$)/
  paragraph: /^/
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n|$)/
  abbr: /^\*\[(label)\] *\n? *: *([^\n]+?) *(?:\n|$)/

block.gfm.abbr = edit(block.gfm.abbr
)( 'label', block._label
)()

block.gfm.paragraph = edit(block.paragraph
)( '(?!', "(?!#{
  block.gfm.fences.source.replace('\\1', '\\2')
}|#{
  block.list.source.replace('\\1', '\\3')
}|"
)()

###
# GFM + Tables Block Grammar
###
block.tables = Object.assign {}, block.gfm,
  table: /^ *(.*\|.*) *\n *((\|?) *:?-+:? *(?:\| *:?-+:? *)*(\|?))(?:\n *((?:\3.*[^>\n ].*\4(?:\n|$))*)|$)/


###
# Inline-Level Grammar
###
inline =
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/
  url: noop
  tag: ///
     ^comment
    |^</[a-zA-Z][\w:-]*\s*>                # self-closing tag
    |^<[a-zA-Z][\w-]*(?:attribute)*?\s*/?> # open tag
    |^<\?[\s\S]*?\?>                       # processing instruction, e.g. <?php ?>
    |^<![a-zA-Z]+\s[\s\S]*?>               # declaration, e.g. <!DOCTYPE html>
    |^<!\[CDATA\[[\s\S]*?\]\]>             # CDATA section
  ///

  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/
  reflink: ///
    ^!?\[(label)\]\[(?!\s*\])((?:
       \\[\[\]]?
      |[^\[\]\\]
    )+)\]
  ///
  nolink: ///
    ^!?\[(?!\s*\])((?:
       \[[^\[\]]*\]
      |\\[\[\]]
      |[^\[\]]
    )*)\](?:\[\])?
  ///
  _strong: ///
    ^codecode(?:
       [^code]
      |[^code]code
      |code[^code]
    )+codecode(?!code)
  ///

  em: ///
     ^_([^\s][\s\S]*?[^\s_])_(?!_)
    |^_([^\s_][\s\S]*?[^\s])_(?!_)
    |^\*([^\s][\s\S]*?[^\s*])\*(?!\*)
    |^\*([^\s*][\s\S]*?[^\s])\*(?!\*)
    |^_([^\s_])_(?!_)
    |^\*([^\s*])\*(?!\*)
  ///
  mdi: /^:(mdi-[^:]+):(?!:)/
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/
  br: /^ {2,}\n(?!\s*$)/
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[`*~=+:\-\^]|\b_| {2,}\n|$)/
  # extended
  note: /^\^\[(label)\]/
  _supsub: /^code(?:[^\s]|codecode)+code(?!code)/

  _url_peice: ///
      ^$
    | ^mailto:
    | :\/\/
    | ^(\.{0,2})[\?\#\/]
    | ^[\w()%+:/]+$
  ///ig

inline.words = (list)->
  keys = list.map (s)-> s.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
  ///(#{ keys.join '|' })///g

inline.strong =
  for c in ['_', '~', '=', ':', '\\*', '\\+', '\\-']
    edit(inline._strong)(/code/g, c)().source
inline.strong.push ///
  ^\[\[(?:
    [^\]]|[^\]]\]|\][^\]]
  )+\]\](?!\])
///.source
inline.strong = new RegExp inline.strong.join("|")

inline.supsub =
  for c in ['\\^', '~']
    edit(inline._supsub)(/code/g, c)().source
inline.supsub = new RegExp inline.supsub.join("|")

inline._escapes = edit(inline.escape, 'g'
)('^',''
)()

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/
inline._email = ///
  [a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+
  (@)
  [a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?
  (?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+
  (?![-_])
///
inline.autolink = edit(inline.autolink
)('scheme', inline._scheme
)('email', inline._email
)()

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
inline.tag = edit(inline.tag
)('comment', block._comment
)('attribute', inline._attribute
)()

inline._label = ///(?:
   \[[^\[\]]*\]
  |\\[\[\]]?
  |`[^`]*`
  |[^\[\]\\]
)*?///
inline._href = ///
    \s*(
       <(?:
         \\[<>]?
        |[^\s<>\\]
      )*>
      |(?:
         \\[()]?
        |\([^\s\x00-\x1f()\\]*\)
        |[^\s\x00-\x1f()\\]
      )*?
    )
  ///
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/

inline.link = edit(inline.link
)('label', inline._label
)('href', inline._href
)('title', inline._title
)()

inline.reflink = edit(inline.reflink
)('label', inline._label
)()

inline.note = edit(inline.note
)('label', inline._label
)()

###
# Normal Inline Grammar
###
inline.normal = Object.assign({}, inline)

###
# Pedantic Inline Grammar
# -- bye --
###

###
# GFM Inline Grammar
###
inline.gfm = Object.assign({}, inline.normal,
  url: edit(
    /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/
  )('email', inline._email)(
  )
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/
  text: edit(
    inline.text
  )('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|'
  )()
)

###
# GFM + Line Breaks Inline Grammar
###
inline.breaks = Object.assign({}, inline.gfm,
  br: edit(inline.br)('{2,}', '*')()
  text: edit(inline.gfm.text)('{2,}', '*')())


module.exports = { block, inline, noop }
