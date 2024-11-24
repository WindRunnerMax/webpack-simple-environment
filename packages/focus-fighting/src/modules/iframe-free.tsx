import type { FC } from "react";
import { Fragment } from "react";
import FocusLock, { FreeFocusInside } from "react-focus-lock@2.13.2";

export const IframeFree: FC = () => {
  return (
    <Fragment>
      <FocusLock>
        <input type="text" />
      </FocusLock>
      <FreeFocusInside>
        <iframe src="/?type=iframe-cross-v13" />
      </FreeFocusInside>
    </Fragment>
  );
};
