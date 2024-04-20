import type { Configuration } from "@rspack/cli";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packages = require("./package.json");
const deps = { ...(packages.dependencies || {}), ...(packages.peerDependencies || {}) };
const externals = Object.keys(deps).map(key => new RegExp(`(^${key}$)|(^${key}/.*)`));

const config: Configuration = {
  context: __dirname,
  entry: {
    index: "./src/rspack/app.tsx",
  },
  externals: externals,
  externalsType: "commonjs",
  externalsPresets: {
    node: true,
  },
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  builtins: {
    define: {
      "__DEV__": JSON.stringify(isDev),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.PUBLIC_URL": JSON.stringify("."),
    },
  },
  module: {
    rules: [
      { test: /\.svg$/, use: "null-loader" },
      { test: /\.less$/, use: "null-loader" },
    ],
  },
  devtool: false,
  output: {
    iife: false,
    libraryTarget: "commonjs",
    publicPath: isDev ? "" : "./",
    path: path.resolve(__dirname, ".temp"),
    filename: "node-side-entry.js",
  },
};

export default config;

// https://www.rspack.dev/
