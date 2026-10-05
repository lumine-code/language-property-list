; Property names are <key> contents, never scalar values or every XML tag.
(element
  (STag (Name) @_tag)
  (content (CharData) @name)
  (#eq? @_tag "key")
  (#set! symbol.tag "property"))
