import type { Dispatch } from "react";
import React, { createContext, useReducer } from "react";

import type { Action } from "./reducer";
import { initialState, reducer } from "./reducer";

export interface ContextProps {
  state: {
    count: number;
  };
  dispatch: Dispatch<Action>;
}

const defaultContext: ContextProps = {
  state: {
    count: 1,
  },
  dispatch: () => void 0,
};

export const AppContext = createContext<ContextProps>(defaultContext);
export const AppProvider: React.FC = props => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
