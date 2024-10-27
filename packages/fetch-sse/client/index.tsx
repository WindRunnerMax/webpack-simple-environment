import { URI } from "laser-utils";
import { Fragment } from "react";
import ReactDOM from "react-dom";

import { Ping } from "./components/ping";

const params = URI.parseParams(location.search);
const type = params.pick("type");

ReactDOM.render(type === "ping" ? <Ping /> : <Fragment />, document.getElementById("root"));
