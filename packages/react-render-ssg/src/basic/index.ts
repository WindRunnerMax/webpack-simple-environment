import fs from "fs/promises";
import React from "react";
import ReactDOMServer from "react-dom/server";

const App = React.createElement(
  React.Fragment,
  null,
  React.createElement("div", null, "React HTML Render"),
  React.createElement(
    "button",
    {
      onClick: () => alert("On Click"),
    },
    "Button"
  )
);

const PRESET = `
const App = React.createElement(
  React.Fragment,
  null,
  React.createElement("div", null, "React HTML Render"),
  React.createElement(
    "button",
    {
      onClick: () => alert("On Click"),
    },
    "Button"
  )
);
const _default = App;
ReactDOM.hydrate(_default, document.getElementById("root"));
`;

(async () => {
  const HTML = ReactDOMServer.renderToString(App);
  const template = await fs.readFile("./src/basic/index.html", "utf-8");
  await fs.mkdir("dist", { recursive: true });
  const random = Math.random().toString(16).substring(7);
  const jsPathName = `${random}.js`;
  const html = template
    .replace(/<!-- INJECT HTML -->/, HTML)
    .replace(/<!-- INJECT SCRIPT -->/, `<script src="${jsPathName}"></script>`);
  await fs.writeFile(`dist/${jsPathName}`, PRESET);
  await fs.writeFile(`dist/index.html`, html);
})();
