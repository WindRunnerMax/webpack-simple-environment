import type { DependencyList, EffectCallback } from "react";
import { useEffect } from "react";

let isMounted = false;
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
    } else {
      return effect();
    }
  }, deps);
};
