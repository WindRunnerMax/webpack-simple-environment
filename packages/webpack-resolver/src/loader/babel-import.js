/**
 * @param {import("@babel/core") babel}
 * @returns {import("@babel/core").PluginObj<{}>}
 */
module.exports = function (babel) {
  const { types: t } = babel;
  return {
    visitor: {
      ImportDeclaration(path) {
        const { node } = path;
        if (!node) return;
        if (node.source.value === "@arco-design/web-react/dist/css/index.less") {
          node.source = t.stringLiteral(require.resolve("./index.less"));
        }
      },
      CallExpression(path) {
        if (
          path.node.callee.name === "require" &&
          path.node.arguments.length === 1 &&
          t.isStringLiteral(path.node.arguments[0]) &&
          path.node.arguments[0].value === "@arco-design/web-react/dist/css/index.less"
        ) {
          path.node.arguments[0] = t.stringLiteral(require.resolve("./index.less"));
        }
      },
    },
  };
};

// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
