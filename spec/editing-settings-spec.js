const path = require("node:path");

describe("property-list editing settings", () => {
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    const pack = await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    await pack.resourceLoadPromise;
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.plist"));
    editor.update({ autoIndent: false });
    await editor.whenGrammarSettled();
  });

  afterEach(() => editor?.destroy());

  async function setText(text) {
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
  }

  it("exposes both supported comment forms while keeping line toggles reversible", async () => {
    const delimiters = await editor.getCommentDelimitersForBufferPosition([0, 0]);
    expect(delimiters.line).toBe("//");
    expect(delimiters.block).toEqual(["/*", "*/"]);
    await setText("node");
    editor.setCursorBufferPosition([0, 0]);
    await editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("// node");
    await editor.whenGrammarSettled();
    await editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("node");
  });
});
