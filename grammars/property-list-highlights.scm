(line_comment) @comment.line.double-slash.plist
(block_comment) @comment.block.plist

((line_comment) @punctuation.definition.comment.plist
  (#set! adjust.startAndEndAroundFirstMatchOf "^//"))
((block_comment) @punctuation.definition.comment.begin.plist
  (#set! adjust.startAndEndAroundFirstMatchOf "^/\\*"))
((block_comment) @punctuation.definition.comment.end.plist
  (#set! adjust.startAndEndAroundFirstMatchOf "\\*/$"))

(number) @constant.numeric.plist
(escape_sequence) @constant.character.escape.plist

(quoted_string) @string.quoted.double.plist
(single_quoted_string) @string.quoted.single.plist
(unquoted_string) @string.unquoted.plist

(quoted_string
  "\"" @punctuation.definition.string.begin.plist .)
(quoted_string
  . "\"" @punctuation.definition.string.end.plist)
(single_quoted_string
  "'" @punctuation.definition.string.begin.plist .)
(single_quoted_string
  . "'" @punctuation.definition.string.end.plist)

(dictionary_entry
  key: (string) @constant.other.key.plist
  (#set! capture.final true))

(data) @string.other.data.plist
(byte) @constant.numeric.hex.plist

"(" @punctuation.definition.array.begin.bracket.round.plist
")" @punctuation.definition.array.end.bracket.round.plist
"{" @punctuation.definition.dictionary.begin.bracket.curly.plist
"}" @punctuation.definition.dictionary.end.bracket.curly.plist
"<" @punctuation.definition.data.begin.plist
">" @punctuation.definition.data.end.plist
"," @punctuation.separator.array.plist
";" @punctuation.terminator.dictionary.plist
"=" @keyword.operator.assignment.plist
