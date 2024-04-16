import "./styles.css";

const TEST_MD = `

调用 CreateFs 接口创建一个 CloudFS 文件存储系统。
## 请求方法

## 请求参数
下表列举了本接口的请求参数。在发起请求时，还需要传入 API 版本、签名等公共请求参数，请参考[公共请求参数](../6720/107857)。

| | | | | | \\
|**参数** |**类型** |**是否必填** |**示例值** |**说明** |
|---|---|---|---|---|
| | | | | | \\
|Action |String |是 |CreateFs |要执行的操作，取值：**CreateFs**。 |
| | | | | | \\
|FsName |String |是 |testfs |文件系统名称，同一个地域内唯一。文件系统命名规则如下： \\
| | | | |* 全局唯一且不能为空字符串。 \\
| | | | |* 长度为 2~63 个字符。 \\
| | | | |* 支持英文字母，只包含字母、数字和短划线（-）。 |
| | | | | | \\
|ChargeType |String |是 |POST_CHARGE |计费类型，目前仅支持 **POST_CHARGE**。 |
| | | | | | \\
|BillingType |String |是 |MONTHLY |账单类型，目前仅支持 **monthly**。 |

`;

const md = require("markdown-it")();
md.use(require("markdown-it-multimd-table"), {
  multiline: true,
  rowspan: true,
  headerless: false,
});

const html = md.render(TEST_MD);
// console.log(html);
document.getElementById("app").innerHTML = html;
