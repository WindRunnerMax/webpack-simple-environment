import type { FC } from "react";
import { Fragment, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock@2.13.2";

export const FightingCheck: FC = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let lastRecord: number = 0;
    let execution: number = 0;
    const cb = (e: FocusEvent) => {
      const now = Date.now();
      if (now - lastRecord >= 10) {
        execution = 0;
        lastRecord = now;
      }
      if (execution++ >= 6) {
        console.error("Callback Exec Limit");
        e.stopPropagation();
      }
    };
    document.addEventListener("focusin", cb, true);
    document.addEventListener("focusout", cb, true);
    return () => {
      document.removeEventListener("focusin", cb, true);
      document.removeEventListener("focusout", cb, true);
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
