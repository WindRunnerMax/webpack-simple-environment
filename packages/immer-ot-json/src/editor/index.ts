import { EventBus } from "laser-utils";

import { History } from "./history";
import { Selection } from "./selection";
import { State } from "./state";

export class Editor {
  public state: State;
  public event: EventBus;
  public history: History;
  public selection: Selection;

  public constructor() {
    this.state = new State(this);
    this.event = new EventBus();
    this.history = new History(this);
    this.selection = new Selection(this);
  }

  public destroy() {
    this.event.clear();
    this.history.destroy();
  }
}
