import { useEffect, useRef, useState } from "react";

export const RefCount: React.FC = () => {
  const ref1 = useRef<HTMLButtonElement>(null);
  const [count, setCount] = useState(0);
  const refCount = useRef<number>(count);

  const add = () => {
    setCount(count + 1);
  };

  refCount.current = count;
  useEffect(() => {
    const el = ref1.current;
    const handler = () => console.log(refCount.current);
    el?.addEventListener("click", handler);
    return () => {
      el?.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div>
      {count}
      <div>
        <button onClick={add}>count++</button>
        <button ref={ref1}>log count 1</button>
      </div>
    </div>
  );
};
