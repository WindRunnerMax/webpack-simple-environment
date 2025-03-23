import type { Editor } from "../editor";
import type { Node } from "../types/state";

export const NODE_TO_PARENT = new WeakMap<Node, Node | Editor>();
export const NODE_TO_INDEX = new WeakMap<Node, number>();
