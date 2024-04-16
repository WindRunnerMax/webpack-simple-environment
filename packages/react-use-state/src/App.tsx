import "./styles.css";

import { useMyState } from "./use-my-state-version-2";

export default function App() {
  const [count1, setCount1] = useMyState(0);
  const [count2, setCount2] = useMyState(0);

  console.log("refresh");
  const addCount1 = () => setCount1(count1 + 1);
  const addCount2 = () => setCount2(count2 + 1);

  return (
    <>
      <div>{count1}</div>
      <button onClick={addCount1}>Count1++</button>
      <div>{count2}</div>
      <button onClick={addCount2}>Count2++</button>
    </>
  );
}
