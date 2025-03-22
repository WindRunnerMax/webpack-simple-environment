import { Bind } from "laser-utils";
import { type } from "ot-json0";

import type { ContentChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
import type { StackItem } from "../types/history";
import type { Range } from "../types/selection";
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
  }

  public destroy() {
    this.undoStack = [];
    this.redoStack = [];
    this.editor.event.off(EVENTS.WILL_APPLY, this.onContentWillChange);
    this.editor.event.off(EVENTS.CONTENT_CHANGE, this.onContentChange);
  }

  @Bind
  protected onContentWillChange() {
    const range = this.editor.selection.get();
    this.currentRange = range;
  }

  @Bind
  protected onContentChange(event: ContentChangeEvent) {
    const { changes } = event;
    if (!changes.length) {
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
}
