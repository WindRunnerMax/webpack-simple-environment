/* eslint-disable @typescript-eslint/no-var-requires */

const Index = require(`<index placeholder>`);
const props = JSON.parse(`<props placeholder>`);
ReactDOM.hydrate(React.createElement(Index.default, { ...props }), document.getElementById("root"));
