import type { FC } from "react";
import { Fragment } from "react";
import FocusLock from "react-focus-lock@2.13.2";

export const Trap: FC = () => {
  return (
    <Fragment>
      <span></span>
      <input type="text" />
      <div style={{ background: "#eee", padding: 10 }}>
        <span>工作区</span>
        <FocusLock>
          <input type="text" />
          <input type="text" />
          <button>button</button>
        </FocusLock>
      </div>
      <input type="text" />
    </Fragment>
  );
};
