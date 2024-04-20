import { observer } from "mobx-react";
import React from "react";

import store from "./mobx-store/store";

const CountMobx: React.FC = () => {
  return (
    <div>
      <div>{store.state.count}</div>
      <button onClick={() => store.setCount(1)}>Set Count value 1</button>
      <button onClick={store.setCountIncrement}>Set Count Increment</button>
    </div>
  );
};

export default observer(CountMobx);
