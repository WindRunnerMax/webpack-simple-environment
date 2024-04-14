import ReactDOM from "react-dom";

import { VirtualizationMode } from "./virtualization";

const LIST = Array.from({ length: 1000 }, (_, i) => {
  const height = Math.floor(Math.random() * 30) + 60;
  return {
    id: i,
    content: (
      <div style={{ height }}>
        {i}-高度:{height}
      </div>
    ),
  };
});

const App = () => {
  return <VirtualizationMode list={LIST} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
