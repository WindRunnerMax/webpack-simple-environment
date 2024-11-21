import React from "react";
import ReactDOM from "react-dom";

import { IframeV9, IframeV13, IframeWar } from "./modules/iframe-war";

const type = new URLSearchParams(location.search).get("type");
let component: JSX.Element = (
  <div>
    <a href="/?type=iframe-war">iframe-war</a>
  </div>
);

switch (type) {
  case "iframe-war":
    component = <IframeWar />;
    break;
  case "iframe-cross-v9":
    component = <IframeV9 />;
    break;
  case "iframe-cross-v13":
    component = <IframeV13 />;
    break;
  default:
    break;
}

ReactDOM.render(component, document.getElementById("root"));
