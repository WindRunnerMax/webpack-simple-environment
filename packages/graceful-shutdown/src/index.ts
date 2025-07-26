import http from "node:http";

// 服务等待停机, 停止接收新的访问请求
// 正在处理的请求, 需要在优雅停机时间内, 将请求处理完毕
// 对于内部正在执行的其他任务, 例如离线任务等需要重置等待调度

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting Down Gracefully...");
  await new Promise(r => setTimeout(r, 2000));
  server.close(() => {
    console.log("Server Closed. Exiting Process.");
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}/`);
});
