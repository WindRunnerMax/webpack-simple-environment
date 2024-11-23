import type { FC } from "react";
import { Fragment, useState } from "react";
import FocusLock, { FreeFocusInside } from "react-focus-lock@2.13.2";

export const MultiLockFree: FC = () => {
  const [len, setLen] = useState(1);

  return (
    <Fragment>
      {new Array(len).fill(null).map((_, index) => (
        <div key={index} style={{ background: "#eee", marginTop: 10, padding: 10 }}>
          <span>工作区 {index}</span>
          <FocusLock>
            <FreeFocusInside>
              <input type="text" />
              <input type="text" />
            </FreeFocusInside>
          </FocusLock>
        </div>
      ))}
      <button onClick={() => setLen(p => p + 1)}>+</button>
      <button onClick={() => setLen(p => Math.max(p - 1, 1))}>-</button>
    </Fragment>
  );
};
