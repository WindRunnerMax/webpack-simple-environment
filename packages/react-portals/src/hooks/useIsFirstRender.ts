import { useEffect, useRef } from "react";

export default function useIsFirstRender() {
  const isFirst = useRef<boolean>(true);
  useEffect(() => {
    isFirst.current = false;
  }, []);
  return isFirst.current;
}
