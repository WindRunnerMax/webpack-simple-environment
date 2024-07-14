module.exports = class LessImportPrefixPlugin {
  constructor(prefixModules) {
    this.prefixModules = prefixModules || [];
    this.minVersion = [2, 7, 1];
  }

  /**
   * @param {string} source
   * @param {object} extra
   * @returns {string}
   */
  process(source) {
    const lines = source.split("\n");
    const next = lines.map(line => {
      const text = line.trim();
      if (!text.startsWith("@import")) return line;
      const result = /@import ['"](.+)['"];?/.exec(text);
      if (!result || !result[1]) return line;
      const uri = result[1];
      for (const it of this.prefixModules) {
        if (uri.startsWith(it)) return `@import "~${uri}";`;
      }
      return line;
    });
    return next.join("\n");
  }

  install(less, pluginManager) {
    pluginManager.addPreProcessor({ process: this.process.bind(this) }, 3000);
  }
};

// https://github.com/less/less-docs/blob/master/content/tools/plugins.md
// https://github.com/less/less-docs/blob/master/content/features/plugins.md
