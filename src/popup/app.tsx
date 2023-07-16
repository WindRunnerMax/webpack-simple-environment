import { FC } from "react";
import { Switch } from "@arco-design/web-react";
import style from "./index.module.scss";
import { cs } from "laser-utils";
import { POPUP_CONTENT_ACTION, PopupContentBridge } from "@/bridge/popup-content";

export const App: FC = () => {
  const onSwitchChange = (
    type:
      | typeof POPUP_CONTENT_ACTION.CONTEXT_MENU
      | typeof POPUP_CONTENT_ACTION.KEY_DOWN
      | typeof POPUP_CONTENT_ACTION.COPY,
    checked: boolean
  ) => {
    PopupContentBridge.postMessage({ type: type, payload: checked });
  };
  return (
    <div className={cs(style.container)}>
      <table>
        <tr>
          <td className={style.logo}>
            <img src="./static/favicon.png" alt="" />
            <span>文本复制-通用</span>
          </td>
          <td>启动</td>
          <td>仅本次</td>
        </tr>
        <tr>
          <td>
            <span className={style.moduleName}>解除复制限制</span>
          </td>
          <td>
            <Switch type="line" onChange={v => onSwitchChange(POPUP_CONTENT_ACTION.COPY, v)} />
          </td>
          <td>
            <Switch type="line" onChange={v => onSwitchChange(POPUP_CONTENT_ACTION.COPY, v)} />
          </td>
        </tr>
        <tr>
          <td>
            <span className={style.moduleName}>解除右键限制</span>
          </td>
          <td>
            <Switch
              type="line"
              onChange={v => onSwitchChange(POPUP_CONTENT_ACTION.CONTEXT_MENU, v)}
            />
          </td>
          <td>
            <Switch
              type="line"
              onChange={v => onSwitchChange(POPUP_CONTENT_ACTION.CONTEXT_MENU, v)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <span className={style.moduleName}>解除键盘限制</span>
          </td>
          <td>
            <Switch type="line" onChange={v => onSwitchChange(POPUP_CONTENT_ACTION.KEY_DOWN, v)} />
          </td>
          <td>
            <Switch type="line" onChange={v => onSwitchChange(POPUP_CONTENT_ACTION.KEY_DOWN, v)} />
          </td>
        </tr>
      </table>
    </div>
  );
};
