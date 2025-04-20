import { DeltaComposer } from "../src/modules/delta-composer";
import { MdComposer } from "../src/modules/md-composer";

describe("streaming", () => {
  it("heading whole", () => {
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
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
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
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
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
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
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
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

  it("list block", () => {
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
    const res = [ms.compose("1. 1\n"), ms.compose("   "), ms.compose("-"), ms.compose(" a")];
    // res.forEach(diff => console.log(JSON.stringify(diff.ops)));
    expect(res.map(it => it.ops)).toEqual([
      [{ insert: "1" }, { insert: "\n", attributes: { ordered: "true", level: "1", index: "1" } }],
      [],
      [],
      [
        { retain: 2 },
        { insert: "a" },
        { attributes: { bullet: "true", level: "2" }, insert: "\n" },
      ],
    ]);
  });

  it("unexpected list heading", () => {
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
    const res = [ms.compose("1. 111\n"), ms.compose("   -"), ms.compose(" a")];
    // res.forEach(diff => console.log(JSON.stringify(diff.ops)));
    expect(res.map(it => it.ops)).toEqual([
      [
        { insert: "111" },
        { insert: "\n", attributes: { ordered: "true", level: "1", index: "1" } },
      ],
      [],
      [
        { retain: 4 },
        { insert: "a" },
        { attributes: { bullet: "true", level: "2" }, insert: "\n" },
      ],
    ]);
  });
});
