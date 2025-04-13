import type { Delta } from "@block-kit/delta";
import { getOpLength, isDeleteOp } from "@block-kit/delta";

/**
 * 获取 delta 指针位置映射的长度
 */
export const getDeltaPointerPosition = (delta: Delta) => {
  return delta.ops.reduce((a, b) => {
    return a + (isDeleteOp(b) ? 0 : getOpLength(b));
  }, 0);
};
