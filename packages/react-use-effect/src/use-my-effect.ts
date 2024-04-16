const dependencyList: unknown[][] = [];
const clearCallbacks: (void | (() => void))[] = [];
let index: number = 0;

export function useMyEffect(callback: () => void | (() => void), deps: unknown[]): void {
  const curIndex = index;
  index++;
  const lastDeps = dependencyList[curIndex];
  const changed = !lastDeps || !deps || deps.some((dep, i) => dep !== lastDeps[i]);
  if (changed) {
    dependencyList[curIndex] = deps;
    const clearCallback = clearCallbacks[curIndex];
    if (clearCallback) clearCallback();
    clearCallbacks[curIndex] = callback();
  }
}

export function clearEffectIndex() {
  index = 0;
}
