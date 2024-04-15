const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const loaderUtils = require("loader-utils");

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

module.exports = async function (source) {
  const done = this.async();
  const filePath = this.context;
  const fileName = this.resourcePath.replace(filePath + "/", "");

  const options = loaderUtils.getOptions(this) || {};
  const styleRegExp = new RegExp(options.style.map(it => `${fileName}\\.${it}$`).join("|"));
  const scriptRegExp = new RegExp(options.script.map(it => `${fileName}\\.${it}$`).join("|"));

  let stylePath = null;
  let scriptPath = null;

  const files = await readDir(filePath);
  files.forEach(file => {
    if (styleRegExp.test(file)) stylePath = path.join(filePath, file);
    if (scriptRegExp.test(file)) scriptPath = path.join(filePath, file);
  });

  // 存在匹配节点且原`.vue`文件不存在`script`标签
  if (scriptPath && !/<script[\s\S]*?>/.test(source)) {
    const extName = scriptPath.split(".").pop();
    if (extName) {
      const content = await readFile(scriptPath, "utf8");
      const scriptTagContent = [
        "<script ",
        extName === "js" ? "" : `lang="${extName}" `,
        ">\n",
        content,
        "</script>",
      ].join("");
      source = source + "\n" + scriptTagContent;
    }
  }

  // 存在匹配节点且原`.vue`文件不存在`style`标签
  if (stylePath && !/<style[\s\S]*?>/.test(source)) {
    const extName = stylePath.split(".").pop();
    if (extName) {
      const content = await readFile(stylePath, "utf8");
      const scoped = /\/\/[\s]scoped[\n]/.test(content) ? true : false;
      const styleTagContent = [
        "<style ",
        extName === "css" ? "" : `lang="${extName}" `,
        scoped ? "scoped " : " ",
        ">\n",
        content,
        "</style>",
      ].join("");
      source = source + "\n" + styleTagContent;
    }
  }

  // console.log(stylePath, scriptPath, source);
  done(null, source);
};
