import ReactDOM from "react-dom";

import { LOG_LEVEL, logger } from "@/utils/logger";

import { App } from "./components/app";

if (__DEV__) {
  logger.setLevel(LOG_LEVEL.INFO);
}

ReactDOM.render(<App></App>, document.getElementById("root"));
