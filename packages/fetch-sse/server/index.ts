import http from "http";

import { ping } from "./modules/ping";
import { stream } from "./modules/stream";
import { transfer } from "./modules/transfer";

http
  .createServer((req, res) => {
    if (req.url === "/" || req.url === "/ping") {
      return ping(req, res);
    }
    if (req.url === "/stream") {
      return stream(req, res);
    }
    if (req.url === "/transfer") {
      return transfer(req, res);
    }
  })
  .listen(8800, "127.0.0.1");

console.log("Server Running At http://127.0.0.1:8800/");
