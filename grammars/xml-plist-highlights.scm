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

(doctypedecl
  "DOCTYPE" @keyword.control.directive.define.xml)

(doctypedecl
  (Name) @entity.name.type.xml)

(STag
  (Name) @entity.name.tag.xml)

(ETag
  (Name) @entity.name.tag.xml)

(EmptyElemTag
  (Name) @entity.name.tag.xml)

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
