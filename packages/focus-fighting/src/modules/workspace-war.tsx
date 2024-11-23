import type { FC } from "react";
import { Fragment } from "react";
import FocusLockV9 from "react-focus-lock@2.9.1";
import FocusLockV13 from "react-focus-lock@2.13.2";

export const WorkspaceWar: FC = () => {
  return (
    <Fragment>
      <FocusLockV9 autoFocus>
        <span>react-focus-lock@2.9.1</span>
        <input type="text" onFocus={() => console.log("focus input-1")} />
        <input type="text" onFocus={() => console.log("focus input-2")} />
      </FocusLockV9>
      <FocusLockV13 autoFocus>
        <span>react-focus-lock@2.13.2</span>
        <input type="text" onFocus={() => console.log("focus input-3")} />
        <input type="text" onFocus={() => console.log("focus input-4")} />
      </FocusLockV13>
    </Fragment>
  );
};
