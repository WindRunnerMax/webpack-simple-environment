import type { Node } from "./node";

export const BATCH = 10;
export const THRESHOLD = 3;
export const DEFAULT_HEIGHT = 60;
export const ELEMENT_TO_NODE = new WeakMap<Element, Node>();
