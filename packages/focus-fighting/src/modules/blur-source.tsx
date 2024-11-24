import type { FC } from "react";
import { Fragment, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock@2.13.2";

export const BlurSource: FC = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let lastInteraction: boolean | null = null;
    const onMouseDown = () => {
      lastInteraction = true;
    };
    const onBlur = (e: FocusEvent) => {
      console.log("lastInteraction", lastInteraction);
      lastInteraction && e.stopPropagation();
      lastInteraction = false;
    };
    const onMouseUp = () => {
      lastInteraction = false;
    };
    document.addEventListener("focusout", onBlur, true);
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("mouseup", onMouseUp, true);
    return () => {
      document.removeEventListener("focusout", onBlur, true);
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("mouseup", onMouseUp, true);
    };
  }, []);

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
