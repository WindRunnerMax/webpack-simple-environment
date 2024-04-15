const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".ts"],
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },
  devServer: {
    hot: true, // 开启热更新
    open: true, // 自动打开浏览器预览
    compress: true, // 开启gzip
    port: 3000, //不指定端口会自动分配
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(scss)$/,
        use: ["vue-style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(ts)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
              limit: 8192, //小于`8K`，用`url-loader`转成`base64` ，否则使用`file-loader`来处理文件
              fallback: {
                loader: "file-loader",
                options: {
                  esModule: false,
                  name: "[name].[hash:8].[ext]",
                  outputPath: "static", //打包之后文件存放的路径, dist/images
                },
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "Webpack Template",
      filename: "index.html", // 打包出来的文件名 根路径是`module.exports.output.path`
      template: path.resolve("./public/index.html"),
      hash: true, // 在引用资源的后面增加`hash`戳
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyCSS: true,
        minifyJS: true,
      },
      inject: "body", // `head`、`body`、`true`、`false`
      scriptLoading: "blocking", // `blocking`、`defer`
    }),
  ],
};
