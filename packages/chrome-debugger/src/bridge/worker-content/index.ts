import { isEmptyValue } from "laser-utils";

import { URL_MATCH } from "@/utils/constant";
import { cross } from "@/utils/global";
import { logger } from "@/utils/logger";

const WC_REQUEST_TYPE = ["PDF_DATA", "__"] as const;
export const POPUP_TO_CONTENT_REQUEST = WC_REQUEST_TYPE.reduce(
  (acc, cur) => ({ ...acc, [cur]: `__${cur}__WC__` }),
  {} as { [K in typeof WC_REQUEST_TYPE[number]]: `__${K}__WC__` }
);

export type WCRequestType = {
  type: typeof POPUP_TO_CONTENT_REQUEST.PDF_DATA;
  payload: string;
};

export class WCBridge {
  public static readonly REQUEST = POPUP_TO_CONTENT_REQUEST;
  public static readonly RESPONSE = null;

  static async postToContent(data: WCRequestType) {
    return new Promise<void | null>(resolve => {
      cross.tabs
        .query({ active: true, currentWindow: true })
        .then(tabs => {
          const tab = tabs[0];
          const tabId = tab && tab.id;
          const tabURL = tab && tab.url;
          if (tabURL && !URL_MATCH.some(match => new RegExp(match).test(tabURL))) {
            resolve(null);
            return void 0;
          }
          if (!isEmptyValue(tabId)) {
            cross.tabs.sendMessage(tabId, data).then(resolve);
          } else {
            resolve(null);
          }
        })
        .catch(error => {
          logger.warning("Send Message Error", error);
        });
    });
  }

  static onWorkerMessage(cb: (data: WCRequestType) => void | null) {
    const handler = (
      message: WCRequestType,
      _: chrome.runtime.MessageSender,
      sendResponse: (response?: void) => void
    ) => {
      const rtn = cb(message);
      rtn && sendResponse(rtn);
    };
    cross.runtime.onMessage.addListener(handler);
    return () => {
      cross.runtime.onMessage.removeListener(handler);
    };
  }
}
