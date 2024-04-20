export const initialState = { count: 0 };
type State = typeof initialState;

export const ACTION = {
  INCREMENT: "INCREMENT" as const,
  SET: "SET" as const,
};
type IncrementAction = {
  type: typeof ACTION.INCREMENT;
};
type SetAction = {
  type: typeof ACTION.SET;
  payload: number;
};
export type Action = IncrementAction | SetAction;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION.INCREMENT:
      return { count: state.count + 1 };
    case ACTION.SET:
      return { count: action.payload };
    default:
      throw new Error();
  }
};
