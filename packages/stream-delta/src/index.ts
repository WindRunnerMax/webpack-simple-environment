import { MutateDelta } from "@block-kit/delta";

import { DeltaComposer } from "./modules/delta-composer";
import { MdComposer } from "./modules/md-composer";
import { getReadableMarkdown } from "./utils/stream";

/**
 * 整体大原则:
 * 1. 非全量解析 Markdown, 基于流渐进式分割结构来解析
 * 2. 基于 Lexer 解析的结构, 双指针绑定 Delta 的增量变更
 */

let delta = new MutateDelta().insertEOL();
const readable = getReadableMarkdown();
const reader = readable.getReader();
const ds = new DeltaComposer();
const ms = new MdComposer(ds);

const reconcile = (text: string) => {
  console.log("SSE TEXT:", JSON.stringify(text));
  const diff = ms.compose(text);
  delta = delta.compose(diff);
  // console.log(JSON.stringify(diff.ops));
};

const start = async () => {
  const { done, value } = await reader.read();
  if (done) {
    console.log("解析完成:");
    console.log(delta.ops.map(op => op.insert));
    console.log(JSON.stringify(delta.ops));
    return;
  }
  reconcile(value.replace(/\\n/g, "\n"));
  start();
};
start();
