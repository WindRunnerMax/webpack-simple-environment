import { Delta } from "@block-kit/delta";
import type { MarkedToken, Token } from "marked";

import type { TokenParserOptions } from "../types";
import { DEFAULT_OPTIONS } from "../types";
import { applyLineMarks, applyMarks } from "./delta";

const coordinate = (tokens: Token[], options: Omit<TokenParserOptions, "index">) => {
  const delta = new Delta();
  tokens.forEach((token, index) => {
    const tokenDelta = parseLexerToken(token, { ...options, index });
    tokenDelta && delta.ops.push(...tokenDelta.ops);
  });
  return delta;
};

/**
 * 将 Token 转换为 Delta
 */
export const parseLexerToken = (
  _block: Token,
  options: TokenParserOptions = DEFAULT_OPTIONS
): Delta => {
  const { depth, parent, index } = options;
  const token = _block as MarkedToken;
  switch (token.type) {
    // 行格式
    case "paragraph": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
      });
      applyLineMarks(delta, {});
      return delta;
    }
    case "heading": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
      });
      // 在列表格式解析的时候, 会存在意外的 heading 格式, 此时作为普通文本处理
      if (!parent || (parent.type !== "list_item" && parent.raw.startsWith("#"))) {
        applyLineMarks(delta, { heading: "h" + token.depth });
      }
      return delta;
    }
    case "blockquote": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
      });
      applyLineMarks(delta, { quote: "true" });
      return delta;
    }
    case "list": {
      const tokens = token.items || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
        listLevel: options.listLevel || 0,
      });
      return delta;
    }
    case "list_item": {
      if (!parent || parent.type !== "list") {
        return new Delta();
      }
      const tokens = token.tokens || [];
      const listLevel = options.listLevel || 1;
      const start = parent.start || 1;
      const delta = new Delta();
      tokens.forEach((child, i) => {
        const tokenDelta = parseLexerToken(child, {
          ...options,
          depth: depth + 1,
          index: i,
          parent: token,
          listLevel: listLevel + 1,
        });
        tokenDelta && delta.ops.push(...tokenDelta.ops);
        // 普通的块节点不会存在块级的 Token, 但是 list_item 可能存在 list 节点
        // 因此必须要特判文本节点来处理行格式, 内部的 list 节点则继续递归处理
        if (!tokenDelta || child.type === "list") {
          return void 0;
        }
        const level = String(listLevel);
        if (parent.ordered === true) {
          const startIndex = String(index + start);
          applyLineMarks(delta, { ordered: "true", level, index: startIndex });
        }
        if (parent.ordered === false) {
          applyLineMarks(delta, { bullet: "true", level });
        }
        if (token.task === true) {
          const checked = String(!!token.checked);
          applyLineMarks(delta, { checkbox: "true", checked, level });
        }
      });
      return delta;
    }
    // 行内格式
    case "strong": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth,
        parent: token,
      });
      applyMarks(delta, { bold: "true" });
      return delta;
    }
    case "em": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
      });
      applyMarks(delta, { italic: "true" });
      return delta;
    }
    case "del": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
      });
      applyMarks(delta, { del: "true" });
      return delta;
    }
    case "link": {
      const tokens = token.tokens || [];
      const delta = coordinate(tokens, {
        ...options,
        depth: depth + 1,
        parent: token,
      });
      applyMarks(delta, { href: token.href, link: "true" });
      return delta;
    }
    case "codespan": {
      const delta = new Delta().insert(token.text, { "inline-code": "true" });
      return delta;
    }
    case "text": {
      if (token.tokens) {
        const tokens = token.tokens || [];
        const delta = coordinate(tokens, {
          ...options,
          depth: depth + 1,
          parent: token,
        });
        return delta;
      }
      const delta = new Delta().insert(token.text);
      return delta;
    }
    default: {
      break;
    }
  }
  return new Delta();
};
