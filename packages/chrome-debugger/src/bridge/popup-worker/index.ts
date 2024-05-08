import { cross } from "@/utils/global";
import type { EventMapToArray, RecordValues } from "@/utils/types";

import type { PWRequestMap, PWRequestType } from "./request";
import { POPUP_TO_WORKER_REQUEST } from "./request";

export class PWBridge {
  public static readonly REQUEST = POPUP_TO_WORKER_REQUEST;
  public static readonly RESPONSE = null;

  static async postToWorker(
    ...args: EventMapToArray<RecordValues<typeof POPUP_TO_WORKER_REQUEST>, PWRequestMap>
  ) {
    const [type, payload] = args;
    return new Promise<null>(resolve => {
      if (cross.runtime.id) {
        cross.runtime.sendMessage({ type, payload }).then(resolve);
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
