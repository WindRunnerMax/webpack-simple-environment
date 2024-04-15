const simulateRemoteData = key => {
  const data = {
    header: "<div>HEADER</div>",
    footer: "<div>FOOTER</div>",
  };
  return Promise.resolve(data[key]);
};

class StaticPageSlice {
  constructor(options) {
    this.options = options || {}; // 传递参数
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("StaticPageSlice", compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: "StaticPageSlice",
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONS,
          additionalAssets: true,
        },
        assets => this.replaceAssets(assets, compilation)
      );
    });
  }

  replaceAssets(assets, compilation) {
    return new Promise(resolve => {
      const cache = {};
      const assetKeys = Object.keys(assets);
      for (const key of assetKeys) {
        const isLastAsset = key === assetKeys[assetKeys.length - 1];
        if (!/.*\.html$/.test(key)) {
          if (isLastAsset) resolve();
          continue;
        }
        let target = assets[key].source();
        const matchedValues = target.matchAll(/<!-- inject:name="(\S*?)" -->/g); // `matchAll`函数需要`Node v12.0.0`以上
        const tags = [];
        for (const item of matchedValues) {
          const [tag, name] = item;
          tags.push({
            tag,
            name,
            data: cache[name] ? cache[name] : simulateRemoteData(name),
          });
        }
        Promise.all(tags.map(item => item.data))
          .then(res => {
            res.forEach((data, index) => {
              const tag = tags[index].tag;
              const name = tags[index].name;
              if (!cache[name]) cache[name] = data;
              target = target.replace(tag, data);
            });
          })
          .then(() => {
            compilation.assets[key] = {
              source() {
                return target;
              },
              size() {
                return this.source().length;
              },
            };
          })
          .then(() => {
            if (isLastAsset) resolve();
          });
      }
    });
  }
}

module.exports = StaticPageSlice;
