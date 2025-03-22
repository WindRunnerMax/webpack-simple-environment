import { getId } from "laser-utils";
import type { Op } from "ot-json0";
import { type } from "ot-json0";

import { EVENTS } from "../types/event";
import type { Snapshot } from "../types/state";
import type { Editor } from ".";

export class State {
  public data: Snapshot;

  public constructor(private editor: Editor) {
    this.data = [];
  }

  public apply(ops: Op[]) {
    const id = getId();
    const previous = this.data;
    this.editor.event.emit(EVENTS.WILL_APPLY, {
      id,
      changes: ops,
      range: this.editor.selection.get(),
    });
    const nextState = type.apply(this.data, ops);
    this.data = nextState;
    this.editor.event.emit(EVENTS.CONTENT_CHANGE, {
      id,
      changes: ops,
      previous,
      current: nextState,
    });
  }
}
