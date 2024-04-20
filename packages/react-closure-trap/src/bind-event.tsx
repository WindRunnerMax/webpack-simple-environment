import { useEffect, useRef, useState } from "react";

export const BindEventCount: React.FC = () => {
  const ref1 = useRef<HTMLButtonElement>(null);
  const [count, setCount] = useState(0);

  const add = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    const el = ref1.current;
    const handler = () => console.log(count);
    el?.addEventListener("click", handler);
    return () => {
      el?.removeEventListener("click", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
