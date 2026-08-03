describe("Property List grammars", function () {
  let oldStyle = null;
  let xml = null;

  beforeEach(function () {
    // The XML grammar delegates the prolog, the doctype, and generic markup to
    // `text.xml`, so language-xml has to be loaded for it to tokenize a real
    // file at all.
    waitsForPromise(() => atom.packages.activatePackage("language-xml"));
    waitsForPromise(() => atom.packages.activatePackage("language-property-list"));

    runs(function () {
      atom.config.set("language.useTreeSitterParsers", false);
      oldStyle = atom.grammars.grammarForScopeName("source.plist");
      xml = atom.grammars.grammarForScopeName("text.xml.plist");
    });
  });

  describe("the old-style grammar", function () {
    it("parses the grammar", function () {
      expect(oldStyle).toBeTruthy();
      expect(oldStyle.scopeName).toBe("source.plist");
    });

    it("tokenizes the encoding comment", function () {
      let { tokens } = oldStyle.tokenizeLine("// !$*UTF8*$!");
      expect(tokens[0]).toEqual({
        value: "//",
        scopes: [
          "source.plist",
          "comment.line.double-slash.plist",
          "punctuation.definition.comment.plist",
        ],
      });
      expect(tokens[1]).toEqual({
        value: " !$*UTF8*$!",
        scopes: ["source.plist", "comment.line.double-slash.plist"],
      });
    });

    it("tokenizes a dictionary and its keys", function () {
      let lines = oldStyle.tokenizeLines(["{", '  key = "value";', "}"].join("\n"));

      expect(lines[0][0]).toEqual({
        value: "{",
        scopes: [
          "source.plist",
          "meta.scope.dictionary.plist",
          "punctuation.definition.dictionary.begin.plist",
        ],
      });

      // TextMate named this scope after the key itself, through a capture
      // transform no Atom-lineage tokenizer implements. It is static here, and
      // must stay free of `${…}`.
      expect(lines[1][1]).toEqual({
        value: "key",
        scopes: [
          "source.plist",
          "meta.scope.dictionary.plist",
          "meta.scope.dictionary-item.plist",
          "constant.other.key.plist",
        ],
      });
      for (let token of lines[1]) {
        for (let scope of token.scopes) {
          expect(scope).not.toContain("${");
        }
      }

      let value = lines[1].find((token) => token.value === "value");
      expect(value.scopes).toContain("string.quoted.double.plist");

      let semicolon = lines[1][lines[1].length - 1];
      expect(semicolon).toEqual({
        value: ";",
        scopes: [
          "source.plist",
          "meta.scope.dictionary.plist",
          "meta.scope.dictionary-item.plist",
          "punctuation.separator.dictionary.plist",
        ],
      });

      expect(lines[2][0]).toEqual({
        value: "}",
        scopes: [
          "source.plist",
          "meta.scope.dictionary.plist",
          "punctuation.definition.dictionary.end.plist",
        ],
      });
    });

    it("tokenizes an array", function () {
      let lines = oldStyle.tokenizeLines(["(", "  a,", "  b", ")"].join("\n"));

      expect(lines[0][0]).toEqual({
        value: "(",
        scopes: [
          "source.plist",
          "meta.scope.array.plist",
          "punctuation.definition.array.begin.plist",
        ],
      });
      expect(lines[1][1].value).toBe("a");
      expect(lines[1][1].scopes).toContain("string.unquoted.plist");
      expect(lines[1][2]).toEqual({
        value: ",",
        scopes: [
          "source.plist",
          "meta.scope.array.plist",
          "meta.scope.array-item.plist",
          "punctuation.separator.array.plist",
        ],
      });
      expect(lines[3][0]).toEqual({
        value: ")",
        scopes: [
          "source.plist",
          "meta.scope.array.plist",
          "punctuation.definition.array.end.plist",
        ],
      });
    });
  });

  describe("the XML grammar", function () {
    it("parses the grammar", function () {
      expect(xml).toBeTruthy();
      expect(xml.scopeName).toBe("text.xml.plist");
    });

    it("tokenizes the prolog and the doctype through text.xml", function () {
      let lines = xml.tokenizeLines(
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN">',
        ].join("\n"),
      );

      expect(lines[0][0].scopes).toContain("meta.tag.preprocessor.xml");
      expect(lines[0][1]).toEqual({
        value: "xml",
        scopes: ["text.xml.plist", "meta.tag.preprocessor.xml", "entity.name.tag.xml"],
      });
      expect(lines[1][1]).toEqual({
        value: "DOCTYPE",
        scopes: ["text.xml.plist", "meta.tag.sgml.doctype.xml", "keyword.other.doctype.xml"],
      });
    });

    it("tokenizes the plist element and its version attribute", function () {
      let { tokens } = xml.tokenizeLine('<plist version="1.0">');

      expect(tokens[1]).toEqual({
        value: "plist",
        scopes: [
          "text.xml.plist",
          "meta.tag.plist.xml.plist",
          "entity.name.tag.xml.plist",
          "entity.name.tag.localname.xml.plist",
        ],
      });
      expect(tokens[3]).toEqual({
        value: "version",
        scopes: [
          "text.xml.plist",
          "meta.tag.plist.xml.plist",
          "entity.other.attribute-name.version.xml.plist",
        ],
      });
    });

    it("scopes key, string, integer and boolean values by their element", function () {
      let lines = xml.tokenizeLines(
        [
          '<plist version="1.0">',
          "<dict>",
          "  <key>Label</key>",
          "  <string>com.example</string>",
          "  <integer>7</integer>",
          "  <true/>",
          "</dict>",
          "</plist>",
        ].join("\n"),
      );

      let scopesFor = (row, value) => lines[row].find((token) => token.value === value).scopes;

      expect(scopesFor(2, "Label")).toEqual(["text.xml.plist", "constant.other.name.xml.plist"]);
      expect(scopesFor(3, "com.example")).toEqual([
        "text.xml.plist",
        "string.quoted.other.xml.plist",
      ]);
      expect(scopesFor(4, "7")).toEqual(["text.xml.plist", "constant.numeric.integer.xml.plist"]);
      expect(scopesFor(5, "true")).toContain("meta.tag.boolean.xml.plist");
    });
  });
});
