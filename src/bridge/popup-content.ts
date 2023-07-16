export const POPUP_CONTENT_ACTION = {
  COPY: "___COPY",
  CONTEXT_MENU: "___CONTEXT_MENU",
  KEY_DOWN: "___KEY_DOWN",
  QUERY_SESSION: "___QUERY_SESSION",
} as const;

export const POPUP_CONTENT_RTN = {
  STATE: "___STATE",
} as const;

type PopupContentAction =
  | {
      type:
        | typeof POPUP_CONTENT_ACTION.CONTEXT_MENU
        | typeof POPUP_CONTENT_ACTION.KEY_DOWN
        | typeof POPUP_CONTENT_ACTION.COPY;
      payload: boolean;
    }
  | {
      type: typeof POPUP_CONTENT_ACTION.QUERY_SESSION;
      payload: string;
    };

type PopupContentRTN = {
  type: (typeof POPUP_CONTENT_RTN)[keyof typeof POPUP_CONTENT_RTN];
  payload: boolean;
};

export class PopupContentBridge {
  static async postMessage(data: PopupContentAction) {
    return new Promise<PopupContentRTN | null>(resolve => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tabId = tabs[0] && tabs[0].id;
        if (tabId) {
          chrome.tabs.sendMessage(tabId, data).then(resolve);
        } else {
          resolve(null);
        }
      });
    });
  }

  static onMessage(cb: (data: PopupContentAction) => void | PopupContentRTN) {
    const handler = (
      message: PopupContentAction,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: PopupContentRTN | null) => void
    ) => {
      const rtn = cb(message);
      sendResponse(rtn || null);
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };
  }
}
