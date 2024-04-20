/* eslint-disable @typescript-eslint/no-var-requires */
import child from "child_process";
import fs from "fs/promises";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { promisify } from "util";

const exec = promisify(child.exec);

const appPath = path.resolve(__dirname, "./app.tsx");
const entryPath = path.resolve(__dirname, "./entry.tsx");
require.extensions[".less"] = () => undefined;

(async () => {
  const distPath = path.resolve("./dist");
  const tempPath = path.resolve("./.temp");
  await fs.mkdir(distPath, { recursive: true });
  await fs.mkdir(tempPath, { recursive: true });

  await exec(`npx rspack -c ./rspack.server.ts`);
  const nodeSideAppPath = path.resolve(tempPath, "node-side-entry.js");
  const nodeSideApp = require(nodeSideAppPath);
  const App = nodeSideApp.default;
  const getStaticProps = nodeSideApp.getStaticProps;
  let defaultProps = {};
  if (getStaticProps) {
    defaultProps = await getStaticProps();
  }

  const entry = await fs.readFile(entryPath, "utf-8");
  const tempEntry = entry
    .replace("<props placeholder>", JSON.stringify(defaultProps))
    .replace("<index placeholder>", appPath);
  await fs.writeFile(path.resolve(tempPath, "client-side-entry.tsx"), tempEntry);

  const HTML = ReactDOMServer.renderToString(React.createElement(App, defaultProps));
  const template = await fs.readFile("./public/index.html", "utf-8");
  const random = Math.random().toString(16).substring(7);
  await exec(`npx rspack build -- --output-filename=${random}`);
  const jsFileName = `${random}.js`;

  const html = template
    .replace(/<!-- INJECT HTML -->/, HTML)
    .replace(/<!-- INJECT STYLE -->/, `<link rel="stylesheet" href="${random}.css">`)
    .replace(/<!-- INJECT SCRIPT -->/, `<script src="${jsFileName}"></script>`);
  await fs.writeFile(path.resolve(distPath, "index.html"), html);
})();
