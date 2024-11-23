import FocusTrapReact from "focus-trap-react";
import type { FC } from "react";
import { Fragment } from "react";
import FocusLock from "react-focus-lock@2.13.2";
import ReactFocusTrap from "react-focus-trap";

export const MultiLockTools: FC = () => {
  return (
    <Fragment>
      <div style={{ background: "#eee", marginTop: 10, padding: 10 }}>
        <span>react-focus-lock</span>
        <FocusLock>
          <input type="text" onFocus={() => console.log("Lock input 1")} />
        </FocusLock>
      </div>
      <div style={{ background: "#eee", marginTop: 10, padding: 10 }}>
        <span>focus-trap-react</span>
        <FocusTrapReact>
          <div>
            <input type="text" onFocus={() => console.log("Lock input 2")} />
          </div>
        </FocusTrapReact>
      </div>
      <div style={{ background: "#eee", marginTop: 10, padding: 10 }}>
        <span>react-focus-trap</span>
        <ReactFocusTrap>
          <input type="text" onFocus={() => console.log("Lock input 3")} />
        </ReactFocusTrap>
      </div>
    </Fragment>
  );
};
