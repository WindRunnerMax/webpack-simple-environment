import type { PWRequestType } from "@/bridge/popup-worker/request";
import { logger } from "@/utils/logger";

export const onPopupMessage = (data: PWRequestType) => {
  logger.info("Worker Receive Popup Message", data);
  return null;
};
