import type { Op } from "ot-json0";

import type { Range } from "./selection";
import type { Snapshot } from "./state";

export const EVENTS = {
  WILL_APPLY: "will-apply",
  CONTENT_CHANGE: "content-change",
  SELECTION_CHANGE: "selection-change",
} as const;

export type WillApplyEvent = {
  id: string;
  changes: Op[];
  range: Range | null;
  source?: string;
};

export type ContentChangeEvent = {
  id: string;
  changes: Op[];
  previous: Snapshot;
  current: Snapshot;
  source?: string;
};

export type SelectionChangeEvent = {
  previous: Range | null;
  current: Range | null;
};

declare module "laser-utils/dist/es/event-bus" {
  interface EventBusType {
    [EVENTS.WILL_APPLY]: WillApplyEvent;
    [EVENTS.CONTENT_CHANGE]: ContentChangeEvent;
    [EVENTS.SELECTION_CHANGE]: SelectionChangeEvent;
  }
}
