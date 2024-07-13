const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @typedef {import("webpack").Configuration} WebpackConfig
 * @typedef {import("webpack-dev-server").Configuration} WebpackDevServerConfig
 */

/**
 * @type {WebpackConfig & {devServer?: WebpackDevServerConfig}}
 */
module.exports = {
  context: __dirname,
  mode: process.env.NODE_ENV,
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },
  stats: "minimal",
  devServer: {
    hot: true,
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["css-loader", "less-loader"],
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve("./public/index.html"),
      hash: true,
      scriptLoading: "defer",
    }),
  ],
};
