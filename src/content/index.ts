import { PopupContentBridge } from "@/bridge/popup-content";

PopupContentBridge.onMessage(message => {
  console.log(message);
});
