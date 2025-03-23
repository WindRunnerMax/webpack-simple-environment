import { createDraft, finishDraft } from "immer";
import { getId } from "laser-utils";
import type { Op } from "ot-json0";
import { type } from "ot-json0";

import { EVENTS } from "../types/event";
import type { Range } from "../types/selection";
import type { Snapshot } from "../types/state";
import { getNode } from "../utils/path";
import type { Editor } from ".";

export class State {
  public data: Snapshot;

  public constructor(private editor: Editor) {
    this.data = [];
  }

  public apply(changes: Op[], source?: string) {
    const id = getId();
    const previous = this.data;
    this.editor.event.emit(EVENTS.WILL_APPLY, {
      id,
      changes: changes,
      range: this.editor.selection.get(),
      source,
    });
    const draft = createDraft(this.data);
    type.apply(draft, changes);
    const nextState = finishDraft(draft);
    this.data = nextState;
    this.editor.event.emit(EVENTS.CONTENT_CHANGE, {
      id,
      changes: changes,
      previous,
      current: nextState,
      source,
    });
    const sel = this.editor.selection.get();
    if (sel) {
      const nextSelOp = type.transform([{ p: sel }], changes, "left");
      if (nextSelOp) {
        const nextSel = nextSelOp[0].p as Range;
        const node = getNode(nextState, nextSel);
        this.editor.selection.set(node ? nextSel : null);
      } else {
        this.editor.selection.set(null);
      }
    }
  }
}
