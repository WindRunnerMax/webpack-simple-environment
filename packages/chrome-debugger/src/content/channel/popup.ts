import type { PCRequestType } from "@/bridge/popup-content";
import { logger } from "@/utils/logger";

export const onPopupMessage = (data: PCRequestType) => {
  logger.info("Content Receive Popup Message", location.host, data);
};
