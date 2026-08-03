const path = require("path");

// The fixture beside this file is a plain sample of the language — the file to
// open when you want to look at the highlighting rather than assert on it. This
// spec is only what stops the sample quietly rotting: the grammar still claims
// it, and it still tokenizes.

describe("Property List sample fixtures", () => {
  beforeEach(async () => {
    await atom.packages.activatePackage("language-xml");
    await atom.packages.activatePackage("language-property-list");
  });

  it("tokenizes sample.plist", async () => {
    const editor = await atom.workspace.open(path.join(__dirname, "fixtures", "sample.plist"));

    expect(editor.getGrammar().scopeName).toBe("text.xml.plist");

    // Every token carries the root scope, so a sample the grammar matched
    // nothing in still tokenizes — it just comes back as one flat run of
    // "text.xml.plist" and nothing else. That is what this rules out.
    const scopes = new Set();
    for (let row = 0; row < editor.getLineCount(); row++) {
      for (const token of editor.tokensForScreenRow(row)) {
        for (const name of token.scopes) scopes.add(name);
      }
    }
    scopes.delete("text.xml.plist");
    expect(scopes.size).toBeGreaterThan(0);
  });
});
