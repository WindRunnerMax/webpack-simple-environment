import React, { useContext } from "react";

import { AppContext, AppProvider } from "./store/context";
import { ACTION } from "./store/reducer";

interface Props {}

const Children: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <>
      Count: {state.count}
      <div>
        <button onClick={() => dispatch({ type: ACTION.INCREMENT })}>INCREMENT</button>
        <button onClick={() => dispatch({ type: ACTION.SET, payload: 10 })}>SET 10</button>
      </div>
    </>
  );
};

const App: React.FC<Props> = () => {
  return (
    <AppProvider>
      <Children />
    </AppProvider>
  );
};

export default App;
