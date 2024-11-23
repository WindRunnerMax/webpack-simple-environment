import "./styles/index.scss";

import ReactDOM from "react-dom";

import { IframeV9, IframeV13, IframeWar } from "./modules/iframe-war";
import { Trap } from "./modules/trap";

const type = new URLSearchParams(location.search).get("type");

const selectComponent = () => {
  switch (type) {
    case "trap":
      return <Trap />;
    case "iframe-war":
      return <IframeWar />;
    case "iframe-cross-v9":
      return <IframeV9 />;
    case "iframe-cross-v13":
      return <IframeV13 />;
    default:
      break;
  }
  return (
    <div className="index-summary">
      <a href="/?type=trap">trap</a>
      <a href="/?type=iframe-war">iframe-war</a>
    </div>
  );
};

ReactDOM.render(selectComponent(), document.getElementById("root"));
