import type { AttributeMap } from "@block-kit/delta";
import { Delta, isEOLOp } from "@block-kit/delta";
import { getOpLength, isDeleteOp } from "@block-kit/delta";

/**
 * 获取 delta 指针位置映射的长度
 */
export const getDeltaPointerPosition = (delta: Delta) => {
  return delta.ops.reduce((a, b) => {
    return a + (isDeleteOp(b) ? 0 : getOpLength(b));
  }, 0);
};

/**
 * 应用行内属性
 * - 原地修改
 */
export const applyMarks = (delta: Delta, attrs: AttributeMap) => {
  delta.ops = delta.ops.map(op => {
    const nextAttrs: AttributeMap = { ...op.attributes, ...attrs };
    return { ...op, attributes: nextAttrs };
  });
  return delta;
};

/**
 * 应用行属性
 * - 原地修改
 */
export const applyLineMarks = (delta: Delta, newAttrs: AttributeMap) => {
  const newDelta = new Delta();
  delta.eachLine((line, attrs, index) => {
    const newLineAttrs = !index ? { ...attrs, ...newAttrs } : attrs;
    const ops = line.ops;
    const lastOp = ops[ops.length - 1];
    if (isEOLOp(lastOp)) {
      lastOp.attributes = newLineAttrs;
      !Object.keys(newLineAttrs).length && delete lastOp.attributes;
    }
    newDelta.ops.push(...line.ops);
  });
  // 原地修改的方式
  delta.ops = newDelta.ops;
  return delta;
};
