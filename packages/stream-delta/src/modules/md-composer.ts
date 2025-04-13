import { Delta } from "@block-kit/delta";
import type { O } from "laser-utils/dist/es/types";
import type { Token } from "marked";
import { marked } from "marked";

import { parseLexerToken } from "../utils/token";
import type { DeltaComposer } from "./delta-composer";

// https://astexplorer.net/
// https://marked.js.org/demo/?outputType=lexer

export class MdComposer {
  /** 正在解析的内容 */
  protected content: string;
  /** 索引幂等的记录 */
  public indexIds: O.Map<string[]>;

  public constructor(protected ds: DeltaComposer) {
    this.content = "";
    this.indexIds = {};
  }

  /**
   * 追加内容
   */
  public compose(text: string) {
    this.content = this.content + text;
    return this.parse();
  }

  /**
   * 解析当前内容
   */
  public parse() {
    const tree = marked.lexer(this.content);
    const delta = new Delta().retain(this.ds.archivedIndex);
    // 这里的指针需要合并已经归档的长度
    // 因为 delta 首个值是 retain, 这里同样需要对齐其长度表达
    let archiveLength = this.ds.archivedIndex;
    // 只迭代 root 的首层子节点
    for (let i = 0; i < tree.length; i++) {
      const prev = tree[i - 1];
      const child = tree[i];
      // 首层子节点存在第二级时，归档上一个节点
      // 此外诸如表格等节点可以正则匹配来避免过早归档
      if (prev && child) {
        this.archive(prev);
        archiveLength = archiveLength + this.ds.archive();
        const deltaLength = delta.length();
        // 若归档长度大于当前 delta 长度，则需要移动指针
        if (archiveLength - deltaLength > 0) {
          delta.ops.push({ retain: archiveLength - deltaLength });
        }
      }
      const section = parseLexerToken(child);
      const diff = this.ds.compose(section);
      delta.ops.push(...diff.ops);
    }
    return delta.chop();
  }

  /**
   * 归档部分内容
   */
  public archive(block: Token) {
    const len = block.raw.length;
    this.content = this.content.slice(len);
  }
}
