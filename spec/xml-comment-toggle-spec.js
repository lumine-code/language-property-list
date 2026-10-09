describe("Property list comment toggling", () => {
  let editor;

  beforeEach(async () => {
    for (const method of ["openExternal", "openPath", "showItemInFolder", "openApplication"])
      spyOn(lumine.shell, method).and.returnValue(Promise.resolve());
    spyOn(lumine.application, "openWindow").and.returnValue(Promise.resolve());
    await lumine.packages.activatePackage("language-property-list");
    editor = await lumine.workspace.open();
  });

  afterEach(() => editor?.destroy());

  it("creates a complete XML comment and restores the source on a second toggle", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.xml.plist"));
    const source = "<plist>\n<string>value</string>\n</plist>";
    editor.setText(source);
    await editor.languageMode.ready;
    editor.setCursorBufferPosition([1, 0]);
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("<plist>\n<!-- <string>value</string> -->\n</plist>");
    await editor.languageMode.atTransactionEnd();
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.languageMode.tree.rootNode.descendantsOfType("Comment").length).toBe(1);
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe(source);
  });

  it("keeps OpenStep line comments and their inverse toggle", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.plist"));
    editor.setText("entry = value;");
    await editor.languageMode.ready;
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("// entry = value;");
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("entry = value;");
  });
});
