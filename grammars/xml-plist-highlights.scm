(XMLDecl
  "xml" @keyword.control.directive.xml)

(XMLDecl
  [
    "version"
    "encoding"
    "standalone"
  ] @entity.other.attribute-name.xml)

(XMLDecl
  (EncName) @string.other.xml)

(XMLDecl
  (VersionNum) @constant.numeric.xml)

(PI) @keyword.control.directive.xml

(("DOCTYPE" @keyword.control.directive.define.xml)
  (#is? test.childOfType doctypedecl))

((Name) @entity.name.type.xml
  (#is? test.childOfType doctypedecl))

((Name) @entity.name.tag.xml
  (#is? test.childOfType "STag ETag EmptyElemTag"))

(Attribute
  (Name) @entity.other.attribute-name.xml)

(Attribute
  (AttValue) @string.quoted.double.xml)

(EntityRef) @constant.other.xml
(CharRef) @constant.character.entity.xml

[
  "<?"
  "<"
  "</"
  "<!"
] @punctuation.definition.tag.begin.xml

[
  "?>"
  ">"
  "/>"
] @punctuation.definition.tag.end.xml

[
  "\""
  "'"
] @punctuation.definition.string.xml

"=" @keyword.operator.assignment.xml

(CDSect
  (CData) @markup.raw.xml)

(Comment) @comment.block.xml
