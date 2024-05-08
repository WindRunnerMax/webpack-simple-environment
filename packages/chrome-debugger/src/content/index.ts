import { PCBridge } from "@/bridge/popup-content";
import { isInIframe } from "@/utils/is";
import { LOG_LEVEL, logger } from "@/utils/logger";

import { onReceiveReloadMsg } from "../utils/reload";
import { onPopupMessage } from "./channel/popup";
import { implantScript } from "./runtime/script";

(() => {
  if (__DEV__) {
    !isInIframe && onReceiveReloadMsg();
    logger.setLevel(LOG_LEVEL.INFO);
  }
  logger.info("Content Script Loaded");
  implantScript();
  PCBridge.onPopupMessage(onPopupMessage);
})();
