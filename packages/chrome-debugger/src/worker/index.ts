import { CWBridge } from "@/bridge/content-worker";
import { LOG_LEVEL, logger } from "@/utils/logger";

import { onContentMessage } from "./channel/content";
import { implantScript } from "./runtime/script";

(() => {
  if (__DEV__) {
    logger.setLevel(LOG_LEVEL.INFO);
  }
  implantScript();
  CWBridge.onContentMessage(onContentMessage);
})();
