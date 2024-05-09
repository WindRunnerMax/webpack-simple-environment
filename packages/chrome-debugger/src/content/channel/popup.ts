import type { PCRequestType } from "@/bridge/popup-content";
import { PCBridge } from "@/bridge/popup-content";
import { isInIframe } from "@/utils/is";
import { logger } from "@/utils/logger";

export const onPopupMessage = (data: PCRequestType) => {
  if (isInIframe) return void 0;
  logger.info("Content Receive Popup Message", location.host, data);
  switch (data.type) {
    case PCBridge.REQUEST.COPY_ALL: {
      document.execCommand("selectAll");
      document.execCommand("copy");
    }
  }
};
