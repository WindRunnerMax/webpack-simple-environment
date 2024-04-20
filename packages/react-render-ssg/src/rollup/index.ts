import child from "child_process";
import fs from "fs/promises";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { promisify } from "util";

import App from "./app";

const exec = promisify(child.exec);

(async () => {
  const HTML = ReactDOMServer.renderToString(React.createElement(App));
  const template = await fs.readFile("./public/index.html", "utf-8");
  const random = Math.random().toString(16).substring(7);
  const path = "./dist/";
  await exec(`npx rollup -c --file=${path + random}.js`);
  const jsPathName = `${random}.js`;
  const html = template
    .replace(/<!-- INJECT HTML -->/, HTML)
    .replace(/<!-- INJECT SCRIPT -->/, `<script src="${jsPathName}"></script>`);
  await fs.writeFile(`${path}index.html`, html);
})();
