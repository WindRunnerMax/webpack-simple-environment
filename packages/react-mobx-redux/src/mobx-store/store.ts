import { action, makeAutoObservable, observable } from "mobx";

class Store {
  constructor() {
    makeAutoObservable(this);
  }

  @observable
  state = {
    count: 1,
  };

  @action
  setCount = (value: number) => {
    this.state.count = value;
  };

  @action
  setCountIncrement = () => {
    this.state.count++;
  };
}

export default new Store();
