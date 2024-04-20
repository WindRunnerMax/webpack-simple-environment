import { createStore } from "redux";

const defaultState: State = {
  count: 1,
};

export const actions = {
  SET_COUNT: "SET_COUNT" as const,
  SET_COUNT_INCREMENT: "SET_COUNT_INCREMENT" as const,
};

const reducer = (state: State = defaultState, action: Actions): State => {
  const { type } = action;
  switch (type) {
    case actions.SET_COUNT: {
      return { ...state, count: action.payload };
    }
    case actions.SET_COUNT_INCREMENT: {
      return { ...state, count: state.count + 1 };
    }
    default:
      return state;
  }
};
export const store = createStore(reducer, defaultState);

export interface State {
  count: number;
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type SET_COUNT_INCREMENT = {
  type: typeof actions.SET_COUNT_INCREMENT;
  payload: void;
};
type SET_COUNT = {
  type: typeof actions.SET_COUNT;
  payload: number;
};
export type Actions = SET_COUNT_INCREMENT | SET_COUNT;
