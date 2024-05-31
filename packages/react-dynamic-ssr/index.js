const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { Button } = require("@arco-design/web-react");
const { transform } = require("sucrase");

const code = `<Button type="primary" onClick={() => alert(1)}>Primary</Button>`;
const OPTIONS = { transforms: ["jsx"], production: true };

const App = () => {
  // 服务端的`React`组件
  const ref = React.useRef(null);

  const getDynamicComponent = () => {
    const { code: compiledCode } = transform(`return (${code.trim()});`, OPTIONS);
    const sandbox = { React, Button };
    const withCode = `with(sandbox) { ${compiledCode} }`;
    const Component = new Function("sandbox", withCode)(sandbox);
    return Component;
  };

  return React.createElement("div", { ref }, getDynamicComponent());
};

const app = express();
const content = ReactDOMServer.renderToString(React.createElement(App));
app.use("/", function (req, res) {
  res.send(
    `<html>
       <head>
         <title>Example</title>
         <link rel="stylesheet" href="https://unpkg.com/@arco-design/web-react@2.53.0/dist/css/arco.min.css">
         <script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react/17.0.2/umd/react.production.min.js" type="application/javascript"></script>
         <script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react-dom/17.0.2/umd/react-dom.production.min.js" type="application/javascript"></script>
       </head>
       <body>
         <div id="root">${content}</div>
       </body>
       <script src="https://unpkg.com/@arco-design/web-react@2.53.0/dist/arco.min.js"></script>
       <script>
        const App = () => { // 客户端的\`React\`组件
          const ref = React.useRef(null);

          const getDynamicComponent = () => {
            const compiledCode = 'return ' + 'React.createElement(Button, { type: "primary", onClick: () => alert(1),}, "Primary")';
            const sandbox= { React, Button: arco.Button };
            const withCode = "with(sandbox) { " + compiledCode + " }";
            const Component = new Function("sandbox", withCode)(sandbox);
            return Component;
          }

          return React.createElement("div", { ref }, getDynamicComponent());
        }
        ReactDOM.hydrate(React.createElement(App), document.getElementById("root"));
        </script>
      </html>`
  );
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listen on port http://localhost:${PORT}`);
});
