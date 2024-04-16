import { useCallback, useEffect, useRef, useState } from "react";

export const CounterCallback: React.FC = () => {
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const [count, setCount] = useState(0);

  const add = () => {
    setCount(count + 1);
  };

  const logCount1 = () => console.log(count);

  useEffect(() => {
    const el = ref1.current;
    el?.addEventListener("click", logCount1);
    return () => {
      el?.removeEventListener("click", logCount1);
    };
  }, []);

  const logCount2 = useCallback(() => {
    console.log(count);
  }, [count]);

  useEffect(() => {
    const el = ref2.current;
    el?.addEventListener("click", logCount2);
    return () => {
      el?.removeEventListener("click", logCount2);
    };
  }, [logCount2]);

  return (
    <div>
      {count}
      <div>
        <button onClick={add}>count++</button>
        <button ref={ref1}>log count 1</button>
        <button ref={ref2}>log count 2</button>
      </div>
    </div>
  );
};
