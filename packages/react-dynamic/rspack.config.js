const path = require("path");
const { default: HtmlPlugin } = require("@rspack/plugin-html");
const CopyPlugin = require("copy-webpack-plugin");

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin([{ from: "public", to: "." }]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  builtins: {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    pluginImport: [
      {
        libraryName: "@arco-design/web-react",
        customName: "@arco-design/web-react/es/{{ member }}",
        style: true,
      },
    ],
  },
  devServer: {
    allowedHosts: [".csb.app"],
  },
  module: {
    rules: [
      { test: /\.svg$/, type: "asset" },
      {
        test: /\.(module|m)\.scss$/,
        use: [{ loader: "sass-loader" }],
        type: "css/module",
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                importLoaders: true,
                localIdentName: "[name]__[hash:base64:5]",
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
};
