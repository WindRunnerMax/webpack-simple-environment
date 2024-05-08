import { Button } from "@arco-design/web-react";
import { cs } from "laser-utils";
import type { FC } from "react";

import styles from "./index.module.scss";

export const App: FC = () => {
  return (
    <div className={cs(styles.container)}>
      <Button>Test</Button>
    </div>
  );
};
