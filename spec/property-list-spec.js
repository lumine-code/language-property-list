const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const XML_HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "xml-plist-highlights.scm");

describe("Property List Tree-sitter grammars", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-property-list");
  });

  async function openFixture(name) {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", name));
    await editor.languageMode.ready;
    return editor;
  }

  it("selects and parses OpenStep property lists", async () => {
    const editor = await openFixture("sample-old-style.plist");
    const languageMode = editor.getBuffer().getLanguageMode();

    expect(editor.getGrammar().scopeName).toBe("source.plist");
    expect(languageMode.tree.rootNode.hasError).toBe(false);

    const text = fs.readFileSync(
      path.join(__dirname, "fixtures", "sample-old-style.plist"),
      "utf8",
    );
    const keyIndex = text.indexOf("archiveVersion");
    const keyPoint = editor.getBuffer().positionForCharacterIndex(keyIndex);
    expect(editor.scopeDescriptorForBufferPosition(keyPoint).getScopesArray()).toContain(
      "constant.other.key.plist",
    );
  });

  it("selects and parses XML property lists", async () => {
    const editor = await openFixture("sample.plist");
    const languageMode = editor.getBuffer().getLanguageMode();

    expect(editor.getGrammar().scopeName).toBe("text.xml.plist");
    expect(languageMode.tree.rootNode.hasError).toBe(false);

    const text = fs.readFileSync(path.join(__dirname, "fixtures", "sample.plist"), "utf8");
    const tagIndex = text.indexOf("<plist") + 1;
    const tagPoint = editor.getBuffer().positionForCharacterIndex(tagIndex);
    expect(editor.scopeDescriptorForBufferPosition(tagPoint).getScopesArray()).toContain(
      "entity.name.tag.xml",
    );
    expect(editor.getGrammar().injectionNames).toEqual(["plist", "xml-plist"]);
    expect(lumine.grammars.treeSitterGrammarForLanguageString("plist")).toBe(editor.getGrammar());
  });

  it("keeps a six-row tile local inside a 6000-attribute XML tag", async () => {
    const editor = await lumine.workspace.open("large-attributes.plist");
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.xml.plist"));
    const lines = [
      "<plist",
      ...Array.from({ length: 6000 }, (_, index) => `  key_${index}="value_${index}"`),
      ">body</plist>",
    ];
    editor.setText(lines.join("\r\n"));
    const languageMode = editor.getBuffer().languageMode;
    await languageMode.ready;
    expect(languageMode.tree.rootNode.hasError).toBe(false);

    const layer = languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(3000, 0),
      endPosition: new Point(3006, 0),
    });

    expect(captures.length).toBeGreaterThan(0);
    expect(captures.length).toBeLessThanOrEqual(45);
    expect(
      captures.every(({ node }) => node.startPosition.row >= 3000 && node.startPosition.row < 3006),
    ).toBe(true);
    expect(editor.scopeDescriptorForBufferPosition([3000, 2]).getScopesArray()).toContain(
      "entity.other.attribute-name.xml",
    );
  });

  it("keeps unbounded XML property-list contexts leaf-rooted", () => {
    const query = fs.readFileSync(XML_HIGHLIGHTS_PATH, "utf8");

    expect(query).toContain('(#is? test.childOfType "STag ETag EmptyElemTag")');
    expect(query).toContain("(#is? test.childOfType doctypedecl)");
    expect(query).not.toMatch(/^\((?:doctypedecl|STag|ETag|EmptyElemTag)\b/m);
  });
});
