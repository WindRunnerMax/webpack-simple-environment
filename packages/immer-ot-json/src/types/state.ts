import type { O } from "laser-utils/dist/es/types";

export type Node = {
  key: string;
  attrs: O.Map<string>;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children?: Node[];
};

export type Snapshot = Node[];
