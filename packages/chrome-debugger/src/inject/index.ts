import { LOG_LEVEL, logger } from "@/utils/logger";

(async (): Promise<void> => {
  if (__DEV__) {
    logger.setLevel(LOG_LEVEL.INFO);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window[process.env.EVENT_TYPE]) {
    logger.info("Inject Script Already Loaded");
    return void 0;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[process.env.EVENT_TYPE] = true;
  logger.info("Inject Script Loaded");
})();
