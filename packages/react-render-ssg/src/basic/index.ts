import ReactDOMServer from "react-dom/server";

import App from "./app";

const HTML = ReactDOMServer.renderToString(App);
console.log("HTML :>> ", HTML);
