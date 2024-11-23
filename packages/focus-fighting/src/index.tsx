import "./styles/index.scss";

import ReactDOM from "react-dom";

import { FocusTrap } from "./modules/focus-trap";
import { IframeV9, IframeV13, IframeWar } from "./modules/iframe-war";
import { InputFocus } from "./modules/input-focus";
import { InputFocusFree } from "./modules/input-focus-free";
import { MultiLock } from "./modules/multi-lock";
import { MultiLockFree } from "./modules/multi-lock-free";
import { MultiLockTools } from "./modules/multi-lock-tools";
import { WorkspaceWar } from "./modules/workspace-war";

const type = new URLSearchParams(location.search).get("type");

const selectComponent = () => {
  switch (type) {
    case "trap":
      return <FocusTrap />;
    case "multi-lock":
      return <MultiLock />;
    case "input-focus":
      return <InputFocus />;
    case "multi-lock-free":
      return <MultiLockFree />;
    case "input-focus-free":
      return <InputFocusFree />;
    case "workspace-war":
      return <WorkspaceWar />;
    case "multi-lock-tools":
      return <MultiLockTools />;
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
      <a href="/?type=multi-lock">multi-lock</a>
      <a href="/?type=input-focus">input-focus</a>
      <a href="/?type=multi-lock-free">multi-lock-free</a>
      <a href="/?type=input-focus-free">input-focus-free</a>
      <a href="/?type=workspace-war">workspace-war</a>
      <a href="/?type=multi-lock-tools">multi-lock-tools</a>
      <a href="/?type=iframe-war">iframe-war</a>
    </div>
  );
};

ReactDOM.render(selectComponent(), document.getElementById("root"));
