import { cross } from "@/utils/global";

const PW_REQUEST_TYPE = ["RELOAD", "__"] as const;
export const CONTENT_TO_WORKER_REQUEST = PW_REQUEST_TYPE.reduce(
  (acc, cur) => ({ ...acc, [cur]: `__${cur}__PW__` }),
  {} as { [K in typeof PW_REQUEST_TYPE[number]]: `__${K}__PW__` }
);

export type PWRequestType = {
  type: typeof CONTENT_TO_WORKER_REQUEST.RELOAD;
  payload: null;
};

export class PWBridge {
  public static readonly REQUEST = CONTENT_TO_WORKER_REQUEST;
  public static readonly RESPONSE = null;

  static async postToWorker(data: PWRequestType) {
    return new Promise<null>(resolve => {
      if (cross.runtime.id) {
        cross.runtime.sendMessage(data).then(resolve);
      } else {
        resolve(null);
      }
    });
  }

  static onPopupMessage(cb: (data: PWRequestType, sender: chrome.runtime.MessageSender) => null) {
    const handler = (
      message: PWRequestType,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: null) => void
    ) => {
      const rtn = cb(message, sender);
      sendResponse(rtn || null);
    };
    cross.runtime.onMessage.addListener(handler);
    return () => {
      cross.runtime.onMessage.removeListener(handler);
    };
  }
}
