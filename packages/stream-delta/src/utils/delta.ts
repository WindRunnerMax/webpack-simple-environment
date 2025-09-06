import type { AttributeMap, Op } from "@block-kit/delta";
import { Delta, isEOLOp, isInsertOp, isRetainOp } from "@block-kit/delta";
import { getOpLength, isDeleteOp } from "@block-kit/delta";

import type { DeltaComposer } from "../modules/delta-composer";

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

/**
 * 获取变更带来的内容片段
 */
export const getContentChangeFragment = (delta: Delta, dc: DeltaComposer) => {
  /** 剩余的 archive retain */
  let archive = dc.archiveIndex;
  /** 目标 archive 变更的长度 */
  let changeLength = 0;
  /** delta 的分割 -> archive | current delta */
  let dividing = 0;
  let op: Op | undefined;
  const newOps = [...delta.ops];
  while ((op = newOps.shift())) {
    if (isRetainOp(op)) {
      if (op.retain > archive) {
        newOps.unshift({ retain: op.retain - archive });
        dividing = dividing + archive;
        break;
      } else {
        archive = archive - op.retain;
        dividing = dividing + op.retain;
      }
      continue;
    }
    if (isDeleteOp(op)) {
      changeLength = changeLength - op.delete;
      dividing = dividing + op.delete;
      continue;
    }
    if (isInsertOp(op)) {
      changeLength = changeLength + op.insert.length;
      dividing = dividing + op.insert.length;
      continue;
    }
  }
  return { delta: new Delta(newOps), changeLength };
};
