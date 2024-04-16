import "./styles.css";

import { useState } from "react";

import { clearEffectIndex, useMyEffect } from "./use-my-effect";

export default function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  console.log("refresh");
  const addCount1 = () => setCount1(count1 + 1);
  const addCount2 = () => setCount2(count2 + 1);

  useMyEffect(() => {
    console.log("count1 -> effect", count1);
    console.log("setTimeout", count1);
    return () => console.log("clear setTimeout", count1);
  }, [count1]);

  useMyEffect(() => {
    console.log("count2 -> effect", count2);
  }, [count2]);

  clearEffectIndex();

  return (
    <>
      <div>{count1}</div>
      <button onClick={addCount1}>Count1++</button>
      <div>{count2}</div>
      <button onClick={addCount2}>Count2++</button>
    </>
  );
}
