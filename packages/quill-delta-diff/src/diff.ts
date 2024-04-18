import diff from "fast-diff";
import Delta from "quill-delta/dist/Delta";
import type Op from "quill-delta/dist/Op";

import { Iterator } from "./iterator";

type AttributeMap = Record<string, string>;

export const diffAttributes = (
  a: AttributeMap = {},
  b: AttributeMap = {}
): AttributeMap | undefined => {
  if (typeof a !== "object") a = {};
  if (typeof b !== "object") b = {};
  const attributes = Object.keys(a)
    .concat(Object.keys(b))
    .reduce<AttributeMap>((attrs, key) => {
      if (a[key] !== b[key]) {
        attrs[key] = b[key] === undefined ? "" : b[key];
      }
      return attrs;
    }, {});
  return Object.keys(attributes).length > 0 ? attributes : undefined;
};

export const diffOps = (ops1: Op[], ops2: Op[]) => {
  const group = [ops1, ops2].map(delta => delta.map(op => op.insert).join(""));
  const result = diff(group[0], group[1]);

  const target = new Delta();
  const iter1 = new Iterator(ops1);
  const iter2 = new Iterator(ops2);

  result.forEach(item => {
    let op1: Op;
    let op2: Op;
    const [type, content] = item;
    let length = content.length; // 每个单元还未处理的长度
    while (length > 0) {
      let opLength = 0; // 本次循环将要处理的长度
      switch (type) {
        case diff.INSERT:
          opLength = Math.min(iter2.peekLength(), length); // min 当前Op剩下可以处理的长度 diff单元还未处理的长度
          target.push(iter2.next(opLength)); // 取出opLength长度的op 如果到头则会进入下一个Op
          break;
        case diff.DELETE:
          opLength = Math.min(length, iter1.peekLength());
          iter1.next(opLength);
          target.delete(opLength);
          break;
        case diff.EQUAL:
          opLength = Math.min(iter1.peekLength(), iter2.peekLength(), length);
          op1 = iter1.next(opLength);
          op2 = iter2.next(opLength);
          if (op1.insert === op2.insert) {
            target.retain(opLength, diffAttributes(op1.attributes, op2.attributes));
          } else {
            console.log(111);
            target.push(op2).delete(opLength);
          }
          break;
        default:
          break;
      }
      length = length - opLength; // 未处理的长度 - 本次循环处理的长度
    }
  });
  return target.chop();
};
