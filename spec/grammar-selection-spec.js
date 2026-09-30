const fs = require("fs");
const path = require("path");

describe("Property List grammar selection", () => {
  let grammar;

  beforeEach(async () => {
    const pkg = await lumine.packages.activatePackage("language-property-list");
    expect(fs.realpathSync(pkg.path)).toBe(path.resolve(__dirname, ".."));
    grammar = lumine.grammars.grammarForScopeName("source.plist");
  });

  it("recognizes OpenStep roots after line and block comments", () => {
    for (const text of [
      "{ key = value; }",
      "(one,two)",
      "// header\r\n{ key = value; }",
      "/* one\nline */ /* two */ { key = value; }",
      "/**/".repeat(10000) + "{}",
    ]) {
      expect(grammar.contentRegex.test(text)).toBe(true);
      expect(lumine.grammars.selectGrammar("modeline.plist", text).scopeName).toBe("source.plist");
    }
  });

  it("stops each block comment at its first closing delimiter", () => {
    for (const text of [
      "/* one */ ignored /* two */ { key = value; }",
      "/* unfinished { key = value; }",
      '<?xml version="1.0"?><plist/>',
    ]) {
      expect(grammar.contentRegex.test(text)).toBe(false);
    }
  });

  it("does not repartition a long comment-only prefix", () => {
    const source = grammar.contentRegex.source.replaceAll("\\/", "/");
    expect(source).toContain("(?:[^*]|\\*(?!/))*");
    // A restored wildcard body would make the failing input exponential.
    // Assert the comment boundary before running the full reproducer.
    if (!source.includes("(?:[^*]|\\*(?!/))*")) return;

    const text = "/**/".repeat(10000) + "x";
    expect(grammar.contentRegex.test(text)).toBe(false);
    expect(lumine.grammars.selectGrammar("modeline.plist", text)).toBeTruthy();
  });
});
