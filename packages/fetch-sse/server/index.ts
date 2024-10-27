import http from "http";

import { ping } from "./ping";
import { stream } from "./stream";

http
  .createServer((req, res) => {
    if (req.url === "/ping") {
      return ping(req, res);
    }
    if (req.url === "/stream") {
      return stream(req, res);
    }
  })
  .listen(8800, "127.0.0.1");
