import type { P } from "laser-utils/dist/es/types";
import type { MarkedToken, Token } from "marked";

export const isListSuspend = (tree: Token[]) => {
  const len = tree.length;
  const secondToLast = tree[len - 2] as P.Nullish<MarkedToken>;
  const last = tree[len - 1] as P.Nullish<MarkedToken>;
  if (!secondToLast || !last) {
    return false;
  }
  // 最后节点是块结构时, 说明列表已经解析完毕
  if (last.type === "code" || last.type === "table" || last.type === "hr") {
    return false;
  }
  // 多级列表嵌套时, 单个字符流追加的情况下, 会出现无法缩进的情况
  // 1. xxx
  //    - xxx
  if (secondToLast.type === "list") {
    return true;
  }
  return false;
};

export const normalizeTokenList = (tree: Token[]) => {
  const copied = [...tree];
  if (copied.length && isListSuspend(copied)) {
    // 移除最后一个节点
    copied.splice(copied.length - 1, 1);
  }
  return copied;
};
