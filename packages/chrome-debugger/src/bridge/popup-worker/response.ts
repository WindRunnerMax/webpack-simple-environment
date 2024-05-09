import type { EventMapToRecord, RecordValues } from "@/utils/types";

const PW_RESPONSE_TYPE = ["_", "__"] as const;
export const POPUP_TO_WORKER_RESPONSE = PW_RESPONSE_TYPE.reduce(
  (acc, cur) => ({ ...acc, [cur]: `__${cur}__PW__` }),
  {} as { [K in typeof PW_RESPONSE_TYPE[number]]: `__${K}__PW__` }
);

export type PWRequestMap = {
  [POPUP_TO_WORKER_RESPONSE._]: string;
};

export type PWResponseType = RecordValues<
  EventMapToRecord<RecordValues<typeof POPUP_TO_WORKER_RESPONSE>, PWRequestMap>
>;
