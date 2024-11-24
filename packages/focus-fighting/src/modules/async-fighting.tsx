import type { FC } from "react";
import { Fragment, useRef } from "react";
import FocusLock from "react-focus-lock@2.13.2";

export const AsyncFighting: FC = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Fragment>
      <div style={{ background: "#eee", marginTop: 10, padding: 10 }}>
        <span>工作区</span>
        <FocusLock autoFocus>
          <input type="text" onFocus={() => console.log("Lock input 1")} />
          <input type="text" onFocus={() => console.log("Lock input 2")} />
        </FocusLock>
      </div>
      <input
        autoFocus
        ref={ref}
        onBlur={() => setTimeout(() => ref.current?.focus(), 0)}
        onFocus={() => console.log("Lock input 3")}
      />
    </Fragment>
  );
};
