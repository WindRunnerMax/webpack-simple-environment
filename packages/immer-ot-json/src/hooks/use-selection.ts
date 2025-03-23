import React, { useContext } from "react";

import type { Range } from "../types/selection";

export const SelectionContext = React.createContext<Range | null>(null);

export const useSelection = () => {
  return useContext(SelectionContext);
};
