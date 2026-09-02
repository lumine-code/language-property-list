const fs = require("fs");
const path = require("path");

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
  });
});
