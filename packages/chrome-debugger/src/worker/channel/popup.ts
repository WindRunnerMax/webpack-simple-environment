import { isEmptyValue } from "laser-utils";

import { PWBridge } from "@/bridge/popup-worker";
import type { PWRequestType } from "@/bridge/popup-worker/request";
import { URL_MATCH } from "@/utils/constant";
import { cross } from "@/utils/global";
import { logger } from "@/utils/logger";

export const onPopupMessage = (data: PWRequestType) => {
  logger.info("Worker Receive Popup Message", data);
  switch (data.type) {
    case PWBridge.REQUEST.START_CDP: {
      cross.tabs
        .query({ active: true, currentWindow: true })
        .then(tabs => {
          const tab = tabs[0];
          const tabId = tab && tab.id;
          const tabURL = tab && tab.url;
          if (tabURL && !URL_MATCH.some(match => new RegExp(match).test(tabURL))) {
            return void 0;
          }
          if (!isEmptyValue(tabId)) {
            // https://chromedevtools.github.io/devtools-protocol/
            chrome.debugger.attach({ tabId }, "1.2", () => {
              chrome.debugger
                .sendCommand({ tabId }, "Input.dispatchKeyEvent", {
                  type: "keyDown",
                  modifiers: 4,
                  keyCode: 65,
                  key: "a",
                  code: "KeyA",
                  windowsVirtualKeyCode: 65,
                  nativeVirtualKeyCode: 65,
                  isSystemKey: true,
                  commands: ["selectAll"],
                })
                .then(() => {
                  chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
                    expression: "document.execCommand('copy')",
                  });
                });
            });
          }
        })
        .catch(error => {
          logger.warning("Send Message Error", error);
        });
    }
  }
  return null;
};
