import { Grid } from "@arco-design/web-react";
import ReactDOM from "react-dom";

import { PlaceholderMode } from "./placeholder";
import { VirtualizationMode } from "./virtualization";
const Row = Grid.Row;
const Col = Grid.Col;

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
  return (
    <Row gutter={24}>
      <Col span={12}>
        <div>IntersectionObserver占位方案</div>
        <PlaceholderMode list={LIST} />
      </Col>
      <Col span={12}>
        <div>IntersectionObserver虚拟化方案</div>
        <VirtualizationMode list={LIST} />
      </Col>
    </Row>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
