import React from "react";

const App = React.createElement(
  React.Fragment,
  null,
  React.createElement("div", null, "React HTML Render"),
  React.createElement(
    "button",
    {
      onClick: console.log,
    },
    "Button"
  )
);

export default App;
