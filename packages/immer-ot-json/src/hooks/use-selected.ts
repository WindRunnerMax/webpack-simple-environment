import { createContext, useContext } from "react";

export const SelectedContext = createContext<boolean>(false);

export const useSelected = () => {
  return useContext(SelectedContext);
};
