import { render } from "react-dom";

import App from "./App";

// 改造一下让其导出 让我们能够强行刷新`<App />`
export const forceRefresh = () => {
  console.log("Force fresh <App />");
  const rootElement = document.getElementById("root");
  render(<App />, rootElement);
};

forceRefresh();
