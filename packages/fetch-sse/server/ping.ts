import type http from "http";

export const ping = (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  res.write("retry: 10000\n");
  res.write("event: connect\n");
  res.write("data: " + new Date() + "\n\n");

  let index = 0;
  const interval = setInterval(() => {
    res.write("id: " + index++ + "\n");
    res.write("data: " + new Date() + "\n\n");
  }, 1000);

  req.on("close", () => {
    console.log("[ping] client connection close");
    clearInterval(interval);
  });
};
