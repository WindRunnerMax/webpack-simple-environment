import http from "http";

export const proxy = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const targetUrl = new URL("http://127.0.0.1:8800/stream");
  const options: http.RequestOptions = {
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: targetUrl.pathname,
    method: req.method,
    headers: req.headers,
  };
  const proxyReq = http.request(options, proxyRes => {
    res.writeHead(proxyRes.statusCode || 404, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);

  proxyReq.on("error", error => {
    console.log("proxy error", error);
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad Gateway");
  });

  req.socket.on("close", () => {
    console.log("[proxy] connection close");
    res.end();
    proxyReq.destroy();
  });
};
