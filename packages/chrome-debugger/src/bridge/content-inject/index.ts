import { decodeJSON, encodeJSON } from "laser-utils";

const EVENT_TYPE = process.env.EVENT_TYPE || "EVENT_TYPE_DG";

const CI_REQUEST_ENUM = ["COPY_ALL", "__"] as const;
export const CONTENT_TO_INJECT_REQUEST = CI_REQUEST_ENUM.reduce(
  (acc, cur) => ({ ...acc, [cur]: `__${cur}__CI__` }),
  {} as { [K in typeof CI_REQUEST_ENUM[number]]: `__${K}___CI__` }
);

export type CIRequestType = {
  type: typeof CONTENT_TO_INJECT_REQUEST.COPY_ALL;
  payload: null;
};

export class CIBridge {
  public static readonly REQUEST = CONTENT_TO_INJECT_REQUEST;
  public static readonly RESPONSE = null;

  static postToInject(data: CIRequestType) {
    window.dispatchEvent(new CustomEvent(EVENT_TYPE, { detail: encodeJSON(data) }));
  }

  static onContentMessage(cb: (data: CIRequestType) => void) {
    const handler = (event: CustomEvent<string>) => {
      const data = decodeJSON<CIRequestType>(event.detail);
      if (data && data.type && data.payload) {
        cb(data);
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.addEventListener(EVENT_TYPE, handler);
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.removeEventListener(EVENT_TYPE, handler);
    };
  }
}
