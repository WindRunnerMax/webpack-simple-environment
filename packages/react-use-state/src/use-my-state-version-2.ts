/* eslint-disable @typescript-eslint/no-explicit-any */
import { forceRefresh } from "./index";

const saveState: any[] = [];
let index: number = 0;

export function useMyState<T>(state: T): [T, (newState: T) => void] {
  const curIndex = index;
  index++;
  saveState[curIndex] = saveState[curIndex] || state;
  const rtnState: T = saveState[curIndex];
  const setState = (newState: T): void => {
    saveState[curIndex] = newState;
    index = 0; // 必须在渲染前后将`index`值重置为`0` 不然就无法借助调用顺序确定`Hooks`了
    forceRefresh();
  };
  return [rtnState, setState];
}
