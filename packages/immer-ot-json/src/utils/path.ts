import { isNil } from "laser-utils";

import { Editor } from "../editor";
import type { Node } from "../types/state";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "./weak-map";

export const findPath = (node: Node | Editor) => {
  const path: number[] = [];
  let child = node;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (child instanceof Editor) {
      return path;
    }
    const parent = NODE_TO_PARENT.get(child);
    if (isNil(parent)) {
      break;
    }
    const i = NODE_TO_INDEX.get(child);
    if (isNil(i)) {
      break;
    }
    path.unshift(i);
    child = parent as Node;
  }
  throw new Error("Unable To Find Path");
};
