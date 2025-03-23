import { CTRL_KEY, KEY_CODE } from "laser-utils";

export const isEqual = (a: number[], b: number[]) => {
  // 注意这里仅为 path 而不是 range, 因此只需要判断是否相等而不需要判断交集
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

export const CTRL = CTRL_KEY;
export const isUndo = (e: KeyboardEvent) => !e.shiftKey && e[CTRL] && e.keyCode === KEY_CODE.Z;
export const isRedo = (e: KeyboardEvent) => e.shiftKey && e[CTRL] && e.keyCode === KEY_CODE.Z;
