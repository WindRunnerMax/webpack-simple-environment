module.exports = {
  apps: [
    {
      script: "./dist/index.js",
      instances: "2",
      exec_mode: "cluster",
      kill_timeout: 5000,
    },
  ],
};
