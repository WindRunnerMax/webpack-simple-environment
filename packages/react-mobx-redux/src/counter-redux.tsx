import React from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, State } from "./redux-store/store";
import { actions } from "./redux-store/store";

const CountRedux: React.FC = () => {
  const count = useSelector((state: State) => state.count);
  const dispatch = useDispatch() as AppDispatch;
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => dispatch({ type: actions.SET_COUNT, payload: 1 })}>
        Set Count value 1
      </button>
      <button onClick={() => dispatch({ type: actions.SET_COUNT_INCREMENT, payload: void 0 })}>
        Set Count Increment
      </button>
    </div>
  );
};

export default CountRedux;
