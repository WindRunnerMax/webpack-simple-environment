import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";

import type { RootContent } from "../types";

// https://astexplorer.net/
// https://marked.js.org/demo/?outputType=lexer

export class MdComposer {
  /** 解析内容 */
  private content: string;

  constructor() {
    this.content = "";
  }
  /**
   * 追加内容
   */
  public append(text: string) {
    this.content = this.content + text;
    this.parse();
  }

  /**
   * 解析内容
   */
  public parse() {
    const tree = fromMarkdown(this.content, {
      mdastExtensions: [gfmFromMarkdown()],
    });
    // 只迭代 root 的首层子节点
    const children = tree.children || [];
    for (let i = 0; i < children.length; i++) {
      const prev = children[i - 1];
      const child = children[i];
      if (prev && child) {
        this.archive(prev);
      }
    }
  }

  /**
   * 归档部分内容
   */
  public archive(block: RootContent) {
    const position = block.position!;
    const offset = position.end.offset!;
    this.content = this.content.slice(offset + 1);
  }
}
