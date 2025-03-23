import { Bind } from "laser-utils";
import type { Op } from "ot-json0";
import { type } from "ot-json0";

import type { ContentChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
import type { StackItem } from "../types/history";
import type { Range } from "../types/selection";
import { isRedo, isUndo } from "../utils/is";
import type { Editor } from ".";

export class History {
  protected readonly DELAY = 1000;
  protected readonly STACK_SIZE = 100;
  protected lastRecord: number;
  protected undoStack: StackItem[];
  protected redoStack: StackItem[];
  protected currentRange: Range | null;

  public constructor(private editor: Editor) {
    this.redoStack = [];
    this.undoStack = [];
    this.lastRecord = 0;
    this.currentRange = null;
    this.editor.event.on(EVENTS.WILL_APPLY, this.onContentWillChange);
    this.editor.event.on(EVENTS.CONTENT_CHANGE, this.onContentChange);
    document.addEventListener("keydown", this.onKeyDown);
  }

  public destroy() {
    this.undoStack = [];
    this.redoStack = [];
    this.editor.event.off(EVENTS.WILL_APPLY, this.onContentWillChange);
    this.editor.event.off(EVENTS.CONTENT_CHANGE, this.onContentChange);
    document.removeEventListener("keydown", this.onKeyDown);
  }

  @Bind
  protected onContentWillChange() {
    const range = this.editor.selection.get();
    this.currentRange = range;
  }

  @Bind
  protected onContentChange(event: ContentChangeEvent) {
    const { changes, source } = event;
    if (!changes.length || source === "history") {
      return void 0;
    }
    this.redoStack = [];

    let inverted = type.invert(changes);
    let undoRange = this.currentRange;
    const timestamp = Date.now();
    if (
      // 如果触发时间在 delay 时间片内 需要合并上一个记录
      this.lastRecord + this.DELAY > timestamp &&
      this.undoStack.length > 0
    ) {
      const item = this.undoStack.pop();
      if (item) {
        for (const base of item.ops) {
          for (let k = 0; k < inverted.length; k++) {
            const op = inverted[k];
            if (!op) continue;
            const nextOp = type.transformComponent([], op, base, "left");
            inverted[k] = nextOp[0];
          }
        }
        inverted = type.compose(item.ops, inverted);
        undoRange = item.range;
      }
    } else {
      this.lastRecord = timestamp;
    }
    if (!inverted.length) {
      return void 0;
    }
    this.undoStack.push({ ops: inverted, range: undoRange });
    if (this.undoStack.length > this.STACK_SIZE) {
      this.undoStack.shift();
    }
  }

  public undo() {
    if (!this.undoStack.length) return void 0;
    const item = this.undoStack.pop();
    if (!item) return void 0;
    const inverted = type.invert(item.ops);
    this.redoStack.push({
      ops: inverted,
      range: this.transformRange(item.range, inverted),
    });
    this.lastRecord = 0;
    this.editor.state.apply(item.ops, "history");
    this.restoreSelection(item);
  }

  public redo() {
    if (!this.redoStack.length) return void 0;
    const item = this.redoStack.pop();
    if (!item) return void 0;
    const inverted = type.invert(item.ops);
    this.undoStack.push({
      ops: inverted,
      range: this.transformRange(item.range, inverted),
    });
    this.lastRecord = 0;
    this.editor.state.apply(item.ops, "history");
    this.restoreSelection(item);
  }

  protected transformRange(range: Range | null, changes: Op[]) {
    if (!range) return range;
    const nextSelOp = type.transform([{ p: range }], changes, "left");
    return nextSelOp ? (nextSelOp[0].p as Range) : null;
  }

  protected restoreSelection(stackItem: StackItem) {
    if (stackItem.range) {
      this.editor.selection.set(stackItem.range);
    }
  }

  @Bind
  protected onKeyDown(event: KeyboardEvent) {
    if (isUndo(event)) {
      this.undo();
      event.preventDefault();
    }
    if (isRedo(event)) {
      this.redo();
      event.preventDefault();
    }
  }
}
