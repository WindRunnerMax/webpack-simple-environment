import type { CWRequestType } from "@/bridge/content-worker";
import { CWBridge } from "@/bridge/content-worker";
import { logger } from "@/utils/logger";
import { RELOAD_APP, reloadApp } from "@/utils/reload";

export const onContentMessage = (data: CWRequestType) => {
  logger.info("Worker Receive Message", data);
  switch (data.type) {
    case CWBridge.REQUEST.RELOAD: {
      reloadApp(RELOAD_APP);
      break;
    }
  }
  return null;
};
