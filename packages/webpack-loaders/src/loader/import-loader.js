/**
 * @typedef {Record<string, unknown>} OptionsType
 * @this {import("webpack").LoaderContext<OptionsType>}
 * @param {string} source
 * @returns {string}
 */
module.exports = function (source) {
  const regexp = /@arco-design\/web-react\/.+\.less/;
  if (regexp.exec(this.resourcePath)) {
    return "@empty: 1px;";
  }
  return source;
};
