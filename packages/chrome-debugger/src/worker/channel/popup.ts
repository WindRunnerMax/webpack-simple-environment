import { isEmptyValue, TSON } from "laser-utils";

import { PWBridge } from "@/bridge/popup-worker";
import type { PWRequestType } from "@/bridge/popup-worker/request";
import { WCBridge } from "@/bridge/worker-content";
import { URL_MATCH } from "@/utils/constant";
import { cross } from "@/utils/global";
import { logger } from "@/utils/logger";

export const onPopupMessage = (data: PWRequestType) => {
  logger.info("Worker Receive Message", data);
  switch (data.type) {
    case PWBridge.REQUEST.COPY_ALL: {
      cross.tabs
        .query({ active: true, currentWindow: true })
        .then(tabs => {
          const tab = tabs[0];
          const tabId = tab && tab.id;
          const tabURL = tab && tab.url;
          if (tabURL && !URL_MATCH.some(match => new RegExp(match).test(tabURL))) {
            return void 0;
          }
          return tabId;
        })
        .then(tabId => {
          if (isEmptyValue(tabId)) return void 0;
          // https://chromedevtools.github.io/devtools-protocol/
          chrome.debugger
            .attach({ tabId }, "1.2")
            .then(() =>
              chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
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
            )
            .then(() => {
              chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
                expression: "document.execCommand('copy')",
              });
            })
            .finally(() => {
              chrome.debugger.detach({ tabId });
            });
        });
      break;
    }
    case PWBridge.REQUEST.PDF: {
      cross.tabs
        .query({ active: true, currentWindow: true })
        .then(tabs => {
          const tab = tabs[0];
          const tabId = tab && tab.id;
          const tabURL = tab && tab.url;
          if (tabURL && !URL_MATCH.some(match => new RegExp(match).test(tabURL))) {
            return void 0;
          }
          return tabId;
        })
        .then(tabId => {
          if (isEmptyValue(tabId)) return void 0;
          // https://chromedevtools.github.io/devtools-protocol/
          chrome.debugger
            .attach({ tabId }, "1.2")
            .then(() =>
              chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
                expression:
                  "JSON.stringify({width: document.body.clientWidth, height: document.body.scrollHeight})",
              })
            )
            .then(res => {
              // @ts-expect-error string
              const value = res.result.value as string;
              const rect = TSON.parse<{ width: number; height: number }>(value);
              return chrome.debugger.sendCommand({ tabId }, "Page.printToPDF", {
                paperHeight: rect ? rect.height / 96 : undefined,
                paperWidth: rect ? rect.width / 96 : undefined,
                generateDocumentOutline: true,
              });
            })
            .then(res => {
              // @ts-expect-error object
              const base64 = res.data as string;
              WCBridge.postToContent({ type: WCBridge.REQUEST.PDF_DATA, payload: base64 });
            })
            .finally(() => {
              chrome.debugger.detach({ tabId });
            });
        });
      break;
    }
  }
  return null;
};
