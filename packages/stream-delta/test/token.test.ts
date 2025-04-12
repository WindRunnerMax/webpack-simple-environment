import { Delta } from "@block-kit/delta";
import { marked } from "marked";

import { parseLexerToken } from "../src/utils/token";

describe("token", () => {
  it("bold delta", () => {
    const tokens = marked.lexer("123**text**456");
    const delta = parseLexerToken(tokens[0]);
    const expected = new Delta().insert("123").insert("text", { bold: "true" }).insert("456\n");
    expect(delta).toEqual(expected);
  });

  it("heading delta", () => {
    const tokens = marked.lexer("# heading");
    const delta = parseLexerToken(tokens[0]);
    const expected = new Delta().insert("heading").insert("\n", { heading: "h1" });
    expect(delta).toEqual(expected);
  });

  it("ordered delta", () => {
    const tokens = marked.lexer("1. level 1\n   3. level 2\n   9. level 3");
    const delta = parseLexerToken(tokens[0]);
    const expected = new Delta()
      .insert("level 1")
      .insertEOL({ ordered: "true", level: "1", index: "1" })
      .insert("level 2")
      .insertEOL({ ordered: "true", level: "2", index: "3" })
      .insert("level 3")
      .insertEOL({ ordered: "true", level: "2", index: "4" });
    expect(delta).toEqual(expected);
  });
});
