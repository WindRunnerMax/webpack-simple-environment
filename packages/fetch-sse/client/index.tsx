import { URI } from "laser-utils";
import ReactDOM from "react-dom";

import { Fetch } from "./components/fetch";
import { Ping } from "./components/ping";

const params = URI.parseParams(location.search);
const type = params.pick("type");

ReactDOM.render(
  type === "ping" ? <Ping /> : type === "fetch" ? <Fetch /> : <Ping />,
  document.getElementById("root")
);
