import React from "react";
import "./styles.css";
import CountMobx from "./counter-mobx";
import CountRedux from "./counter-redux";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux-store/store";

const App: React.FC = () => {
  return (
    <div>
      <div>======Mobx======</div>
      <CountMobx />
      <br />
      <div>======Redux======</div>
      <ReduxProvider store={store}>
        <CountRedux />
      </ReduxProvider>
    </div>
  );
};

export default App;
