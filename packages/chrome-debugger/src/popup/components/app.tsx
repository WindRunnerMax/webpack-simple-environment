import { Button } from "@arco-design/web-react";
import { IconGithub, IconQuestionCircle, IconRefresh } from "@arco-design/web-react/icon";
import { cs } from "laser-utils";
import type { FC } from "react";
import { useState } from "react";

import { PCBridge } from "@/bridge/popup-content";
import { PWBridge } from "@/bridge/popup-worker";
import { cross } from "@/utils/global";

import styles from "./index.module.scss";

export const App: FC = () => {
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    setTimeout(() => {
      PCBridge.postToContent({
        type: PCBridge.REQUEST.COPY_ALL,
        payload: null,
      });
      setLoading(false);
    }, 5000);
  };

  const onDevTools = () => {
    setLoading(true);
    setTimeout(() => {
      PWBridge.postToWorker(PWBridge.REQUEST.COPY_ALL, null);
      setLoading(false);
    }, 5000);
  };

  return (
    <div className={cs(styles.container)}>
      <div className={cs(styles.captain)}>
        <img src="./static/favicon.128.png" alt="" />
        <span>Chrome Debugger</span>
      </div>

      <div className={styles.hr}></div>

      <div className={styles.console}>
        <div className={styles.line}>
          <Button loading={loading} type="primary" onClick={onClick}>
            JavaScript
          </Button>
          <Button loading={loading} type="primary" onClick={onDevTools}>
            DevTools
          </Button>
        </div>
      </div>

      <div className={styles.hr}></div>

      <div className={styles.footer}>
        <a
          onClick={() => window.open("https://github.com/WindrunnerMax/webpack-simple-environment")}
        >
          <IconGithub />
          GitHub
        </a>
        <a
          onClick={() => window.open("https://github.com/WindrunnerMax/webpack-simple-environment")}
        >
          <IconQuestionCircle />
          Help
        </a>
        {__DEV__ && (
          <a onClick={() => cross.runtime.reload()}>
            <IconRefresh />
            Reload
          </a>
        )}
      </div>
    </div>
  );
};
