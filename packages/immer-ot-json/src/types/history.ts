import type { Ops } from "ot-json0";

import type { Range } from "./selection";

export type StackItem = {
  ops: Ops;
  range: Range | null;
};
