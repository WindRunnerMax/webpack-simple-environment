import { CWBridge } from "@/bridge/content-worker";
import { PWBridge } from "@/bridge/popup-worker";
import { LOG_LEVEL, logger } from "@/utils/logger";

import { onContentMessage } from "./channel/content";
import { onPopupMessage } from "./channel/popup";
import { implantScript } from "./runtime/script";

(() => {
  if (__DEV__) {
    logger.setLevel(LOG_LEVEL.INFO);
  }
  implantScript();
  CWBridge.onContentMessage(onContentMessage);
  PWBridge.onPopupMessage(onPopupMessage);
})();
