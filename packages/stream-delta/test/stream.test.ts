import { DeltaComposer } from "../src/modules/delta-composer";
import { MdComposer } from "../src/modules/md-composer";

describe("streaming", () => {
  it("heading whole", () => {
    const ds = new DeltaComposer();
    const ms = new MdComposer(ds);
    const diff1 = ms.compose("# 测试文档\n\n");
    const diff2 = ms.compose("初始多行");
    // console.log(JSON.stringify(diff1.ops));
    // console.log(JSON.stringify(diff2.ops));
    expect(diff1.ops).toEqual([
      { insert: "测试文档" },
      { attributes: { heading: "h1" }, insert: "\n" },
    ]);
    expect(diff2.ops).toEqual([{ retain: 5 }, { insert: "初始多行\n" }]);
  });

  it("heading divide", () => {
    const ds = new DeltaComposer();
    const ms = new MdComposer(ds);
    const diff1 = ms.compose("# 测试文");
    const diff2 = ms.compose("档\n\n初始多行");
    // console.log(JSON.stringify(diff1.ops));
    // console.log(JSON.stringify(diff2.ops));
    expect(diff1.ops).toEqual([
      { insert: "测试文" },
      { attributes: { heading: "h1" }, insert: "\n" },
    ]);
    expect(diff2.ops).toEqual([
      { retain: 3 },
      { insert: "档" },
      { retain: 1 },
      { insert: "初始多行\n" },
    ]);
  });

  it("missing \n", () => {
    const ds = new DeltaComposer();
    const ms = new MdComposer(ds);
    const diff1 = ms.compose("# 测试文档\n\n初始多行文本内容\n初始多");
    const diff2 = ms.compose("行文本内容\n初始多行文本内容\n\n## 二级标题\n");
    // console.log(JSON.stringify(diff1.ops));
    // console.log(JSON.stringify(diff2.ops));
    expect(diff1.ops).toEqual([
      { insert: "测试文档" },
      { attributes: { heading: "h1" }, insert: "\n" },
      { insert: "初始多行文本内容\n初始多\n" },
    ]);
    expect(diff2.ops).toEqual([
      { retain: 17 },
      { insert: "行文本内容\n初始多行文本内容" },
      { retain: 1 },
      { insert: "二级标题" },
      { insert: "\n", attributes: { heading: "h2" } },
    ]);
  });

  it("unexpected cutoff", () => {
    const ds = new DeltaComposer();
    const ms = new MdComposer(ds);
    // let delta = new MutateDelta().insertEOL();
    const res = [
      ms.compose("## 二级标题\n**"),
      ms.compose("加粗**\n\n### 三级"),
      ms.compose("标题"),
    ];
    // res.forEach(diff => console.log(JSON.stringify(diff.ops)));
    // res.forEach(diff => (delta = delta.compose(diff)));
    // console.log("delta.ops :>> ", delta.ops);
    expect(res.map(it => it.ops)).toEqual([
      [{ insert: "二级标题" }, { attributes: { heading: "h2" }, insert: "\n" }, { insert: "**\n" }],
      [
        { retain: 5 },
        { attributes: { bold: "true" }, insert: "加粗" },
        { delete: 2 },
        { retain: 1 },
        { insert: "三级" },
        { insert: "\n", attributes: { heading: "h3" } },
      ],
      [{ retain: 10 }, { insert: "标题" }],
    ]);
  });
});
