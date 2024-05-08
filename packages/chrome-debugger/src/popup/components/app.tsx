import { Button } from "@arco-design/web-react";
import { IconGithub, IconQuestionCircle, IconRefresh } from "@arco-design/web-react/icon";
import { cs } from "laser-utils";
import type { FC } from "react";

import { PWBridge } from "@/bridge/popup-worker";
import { cross } from "@/utils/global";

import styles from "./index.module.scss";

export const App: FC = () => {
  const onStartCDP = () => {
    PWBridge.postToWorker(PWBridge.REQUEST.START_CDP, null);
  };

  return (
    <div className={cs(styles.container)}>
      <div className={cs(styles.captain)}>
        <img src="./static/favicon.128.png" alt="" />
        <span>Chrome Debugger</span>
      </div>

      <div className={styles.hr}></div>

      <div className={styles.console}>
        <Button>JavaScript方法</Button>
        <Button onClick={onStartCDP}>DevTools Protocol方法</Button>
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
