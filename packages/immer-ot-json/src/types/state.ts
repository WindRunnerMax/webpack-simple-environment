import type { O } from "laser-utils/dist/es/types";

export type Node = {
  key: string;
  attrs: O.Map<string>;
  children?: Node[];
};

export type Snapshot = Node[];
