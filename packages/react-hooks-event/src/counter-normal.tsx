import { useState } from "react";

export const CounterNormal: React.FC = () => {
  const [count, setCount] = useState(0);
  const add = () => {
    setCount(count + 1);
  };
  return (
    <div>
      {count}
      <div>
        <button onClick={add}>count++</button>
      </div>
    </div>
  );
};
