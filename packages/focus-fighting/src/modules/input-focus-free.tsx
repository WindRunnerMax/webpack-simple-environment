import type { FC } from "react";
import { Fragment, useRef } from "react";
import FocusLock, { FreeFocusInside } from "react-focus-lock@2.13.2";

export const InputFocusFree: FC = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Fragment>
      <div style={{ background: "#eee", marginTop: 10, padding: 10 }}>
        <span>工作区 1</span>
        <FocusLock>
          <input type="text" onFocus={() => console.log("Lock input 1")} />
          <input type="text" onFocus={() => console.log("Lock input 2")} />
        </FocusLock>
      </div>
      <FreeFocusInside>
        <input
          ref={ref}
          onBlur={() => setTimeout(() => ref.current?.focus(), 1000)}
          onFocus={() => console.log("Lock input 3")}
        />
      </FreeFocusInside>
    </Fragment>
  );
};
