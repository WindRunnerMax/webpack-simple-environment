import { URI } from "laser-utils";
import ReactDOM from "react-dom";

import { Fetch } from "./components/fetch";
import { Ping } from "./components/ping";
import { Stream } from "./components/stream";

const params = URI.parseParams(location.search);
const type = params.pick("type");

ReactDOM.render(
  (() => {
    switch (type) {
      case "ping":
        return <Ping />;
      case "fetch":
        return <Fetch />;
      case "stream":
        return <Stream />;
      default:
        return <Ping />;
    }
  })(),
  document.getElementById("root")
);
