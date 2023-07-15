const thread = require("child_process");
const path = require("path");

const exec = command => {
  return new Promise((resolve, reject) => {
    thread.exec(command, (err, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

class FilesPlugin {
  apply(compiler) {
    compiler.hooks.make.tap("JsonWatcher", compilation => {
      compilation.fileDependencies.add(path.join(__dirname, "../src/manifest.json"));
    });

    compiler.hooks.done.tapPromise("FilePlugin", () => {
      return Promise.all([
        exec("cp ./src/manifest.json ./dist/"),
        exec("cp -r ./public/static ./dist/static"),
      ]);
    });
  }
}

module.exports = FilesPlugin;
