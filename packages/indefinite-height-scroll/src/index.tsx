import ReactDOM from "react-dom";

export const LIST = Array.from({ length: 1000 }, (_, i) => {
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
  return <div>111</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
