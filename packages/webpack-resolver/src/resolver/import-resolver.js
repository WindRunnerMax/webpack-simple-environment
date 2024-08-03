module.exports = class ImportResolver {
  constructor() {}

  /**
   * @typedef {Required<import("webpack").Configuration>["resolve"]} ResolveOptionsWebpackOptions
   * @typedef {Exclude<Required<ResolveOptionsWebpackOptions>["plugins"]["0"], "...">} ResolvePluginInstance
   * @typedef {Parameters<ResolvePluginInstance["apply"]>["0"]} Resolver
   * @param {Resolver} resolver
   */
  apply(resolver) {
    const target = resolver.ensureHook("resolve");

    resolver
      .getHook("before-resolve")
      .tapAsync("ImportResolverPlugin", (request, resolveContext, callback) => {
        const regexp = /@arco-design\/web-react\/.+\.less/;
        const prev = request.request;
        const next = require.resolve("./index.less");
        if (regexp.test(prev)) {
          const newRequest = { ...request, request: next };
          return resolver.doResolve(
            target,
            newRequest,
            `Resolved ${prev} to ${next}`,
            resolveContext,
            callback
          );
        }
        return callback();
      });
  }
};

// https://webpack.js.org/configuration/resolve/#resolveplugins
// https://github.com/webpack/enhanced-resolve?tab=readme-ov-file#plugins
