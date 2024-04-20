import "./app.less";

import { Button } from "@arco-design/web-react";
import React from "react";

const App: React.FC<{ name: string }> = props => (
  <React.Fragment>
    <div>React Render SSG With {props.name}</div>
    <Button style={{ marginTop: 10 }} type="primary" onClick={() => alert("On Click")}>
      Button
    </Button>
  </React.Fragment>
);

export const getStaticProps = () => {
  return Promise.resolve({
    name: "Static Props",
  });
};

export default App;
