import type http from "http";
import fetch from "node-fetch";
import type { AbortSignal } from "node-fetch/externals";

import { StreamParser } from "../utils/steam-parser";

export const transfer = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const ctrl = new AbortController();
  const response = await fetch("http://127.0.0.1:8800/stream", {
    signal: ctrl.signal as AbortSignal,
  });
  const readable = response.body;
  if (!readable) return null;

  req.socket.on("close", () => {
    console.log("[transfer] connection close");
    ctrl.abort();
    res.end();
  });

  const parser = new StreamParser();
  parser.onMessage = message => {
    res.write(`event: ${message.event}\n`);
    res.write(`data: ${message.data}\n\n`);
  };

  for await (const chunk of readable) {
    const buffer = chunk as Buffer;
    const uint = new Uint8Array(buffer);
    parser.onBinary(uint);
  }

  res.end();
};
