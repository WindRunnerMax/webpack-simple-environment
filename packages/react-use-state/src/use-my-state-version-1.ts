/* eslint-disable @typescript-eslint/no-explicit-any */
import { forceRefresh } from "./index";

let saveState: any = null;

export function useMyState<T>(state: T): [T, (newState: T) => void] {
  saveState = saveState || state;
  const rtnState: T = saveState;
  const setState = (newState: T): void => {
    saveState = newState;
    forceRefresh();
  };
  return [rtnState, setState];
}
