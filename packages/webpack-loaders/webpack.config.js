const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LessImportPrefix = require("./src/less/import-prefix");

const entries = {
  less: "./src/less/index.ts",
  loader: "./src/loader/index.ts",
  resolver: "./src/resolver/index.ts",
};

const HTMLPlugins = Object.keys(entries).map(
  key =>
    new HtmlWebpackPlugin({
      filename: `${key}.html`,
      template: path.resolve("./public/index.html"),
      hash: true,
      chunks: [key],
      scriptLoading: "defer",
      inject: "body",
    })
);

/**
 * @typedef {import("webpack").Configuration} WebpackConfig
 * @typedef {import("webpack-dev-server").Configuration} WebpackDevServerConfig
 * @type {WebpackConfig & {devServer?: WebpackDevServerConfig}}
 */
module.exports = {
  context: __dirname,
  mode: process.env.NODE_ENV,
  entry: entries,
  output: {
    filename: "[name].bundle.js",
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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              plugins: [new LessImportPrefix(["@arco-design/web-react"])],
            },
          },
        ],
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
      filename: `index.html`,
      template: path.resolve("./public/index.html"),
      chunks: [],
      scriptLoading: "defer",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    ...HTMLPlugins,
  ],
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "deterministic",
  },
};
