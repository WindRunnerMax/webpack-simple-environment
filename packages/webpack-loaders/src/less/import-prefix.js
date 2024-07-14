// https://github.com/less/less-docs/blob/master/content/tools/plugins.md
// https://github.com/less/less-docs/blob/master/content/features/plugins.md

class LessImportPrefixPlugin {
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
      if (!text.startsWith("@import")) return text;
      const result = /@import ['"](.+)['"];?/.exec(text);
      if (!result || !result[1]) return text;
      const uri = result[1];
      for (const it of this.prefixModules) {
        if (uri.startsWith(it)) return `@import "~${uri}";`;
      }
      return text;
    });
    return next.join("\n");
  }

  install(less, pluginManager) {
    pluginManager.addPreProcessor({ process: this.process.bind(this) }, 3000);
  }
}

module.exports = LessImportPrefixPlugin;
