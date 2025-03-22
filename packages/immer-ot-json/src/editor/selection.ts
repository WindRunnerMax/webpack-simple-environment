import { EVENTS } from "../types/event";
import type { Range } from "../types/selection";
import type { Editor } from ".";

export class Selection {
  private previous: Range | null = null;
  private current: Range | null = null;

  public constructor(private editor: Editor) {}

  public set(range: Range | null) {
    if (this.previous === range) {
      return void 0;
    }
    const previous = this.previous;
    this.previous = this.current;
    this.current = range;
    this.editor.event.emit(EVENTS.SELECTION_CHANGE, {
      previous,
      current: this.current,
    });
  }

  public get() {
    return this.current;
  }
}
