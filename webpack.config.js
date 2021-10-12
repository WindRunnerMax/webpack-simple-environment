const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/index.js",
    output: {
        filename: "index.js",
        path:path.resolve(__dirname, "dist")
    },
    devServer: {
        hot: true, // 开启热更新
        open: true, // 自动打开浏览器预览
        compress: true, // 开启gzip
        port: 3000  //不指定端口会自动分配
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader",
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader"
                ],
            },
        ],
    },
    plugins:[
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
            scriptLoading: "blocking" // `blocking`、`defer`
        })
    ]
}
