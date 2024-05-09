import type { WCRequestType } from "@/bridge/worker-content";
import { WCBridge } from "@/bridge/worker-content";
import { isInIframe } from "@/utils/is";
import { logger } from "@/utils/logger";

export const onWorkerMessage = (data: WCRequestType) => {
  if (isInIframe) return void 0;
  logger.info("Content Receive Message", location.host, data);
  switch (data.type) {
    case WCBridge.REQUEST.PDF_DATA: {
      const base64 = data.payload;
      const binary = atob(base64);
      const array = new Uint8Array(new ArrayBuffer(binary.length));
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "download.pdf";
      a.click();
      break;
    }
  }
};
