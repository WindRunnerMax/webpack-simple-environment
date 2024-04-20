import React, { useState } from "react";

const collect: (() => number)[] = [];

export const MultiCount: React.FC = () => {
  const [count, setCount] = useState(0);

  const click = () => {
    setCount(count + 1);
  };

  collect.push(() => count);

  const logCollect = () => {
    collect.forEach(fn => console.log(fn()));
  };

  return (
    <div>
      <div>{count}</div>
      <button onClick={click}>count++</button>
      <button onClick={logCollect}>log {">>"} collect</button>
    </div>
  );
};
