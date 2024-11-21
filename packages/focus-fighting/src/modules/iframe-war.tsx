import type { FC } from "react";
import FocusLockV9 from "react-focus-lock@2.9.1";
import FocusLockV13 from "react-focus-lock@2.13.2";

// https://github.com/theKashey/react-focus-lock/issues/249#issuecomment-1624636487
// https://github.com/reach/reach-ui/issues/536#issuecomment-613129898

export const IframeV9: FC = () => {
  return (
    <FocusLockV9 crossFrame={false} autoFocus={false}>
      <span>react-focus-lock@2.9.1 no-cross-frame</span>
      <input />
    </FocusLockV9>
  );
};

export const IframeV13: FC = () => {
  return (
    <FocusLockV13 crossFrame={false} autoFocus={false}>
      <span>react-focus-lock@2.13.2 no-cross-frame</span>
      <input />
    </FocusLockV13>
  );
};

export const IframeWar: FC = () => {
  return (
    <div>
      <input type="text" />
      <iframe src="/?type=iframe-cross-v9" />
      <iframe src="/?type=iframe-cross-v13" />
    </div>
  );
};
