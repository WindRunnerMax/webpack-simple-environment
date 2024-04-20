import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import path from "path";
import postcss from "rollup-plugin-postcss";
import ts from "rollup-plugin-typescript2";
const APP_NAME = "ReactSSG";
const random = Math.random().toString(16).substring(7);

export default async () => {
  return {
    input: "./src/framework/app.tsx",
    output: {
      name: APP_NAME,
      file: `./build/${random}.js`,
      format: "iife",
      globals: {
        "react": "React",
        "react-dom": "ReactDOM",
      },
      footer: `ReactDOM.hydrate(React.createElement(${APP_NAME}), document.getElementById("root"));`,
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs({ include: /node_modules/ }),
      postcss({
        extract: `${random}.css`,
        minimize: true,
        extensions: [".css", ".scss", ".less"],
        use: {
          less: { javascriptEnabled: true },
        },
      }),
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
        preventAssignment: true,
      }),
      ts({
        tsconfig: path.resolve(__dirname, "./tsconfig.build.json"),
        extensions: [".ts", ".tsx"],
      }),
    ],
    external: ["react", "react-dom"],
  };
};
