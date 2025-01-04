import type { Op } from "ot-json0";
import { type } from "ot-json0";

describe("batch transform", () => {
  it("ops", () => {
    const baseState = {
      a: {
        b: [0, 1, 2, 3, 4, 5, 6] as number[],
      },
    };
    const ops: Op[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 2], ld: 2 },
      { p: ["a", "b", 3], ld: 3 },
      { p: ["a", "b", 3], ld: 3 },
    ];
    const nextState = type.apply(baseState, ops);
    expect(nextState.a.b).toEqual([0, 2, 4]);
  });

  it("transform ops", () => {
    const baseState = {
      a: {
        b: [0, 1, 2, 3, 4, 5, 6] as number[],
      },
    };
    const ops: Op[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 2], ld: 2 },
      { p: ["a", "b", 3], ld: 3 },
      { p: ["a", "b", 3], ld: 3 },
    ];
    const tfOps = ops.map((op, index) => {
      const appliedOps = ops.slice(0, index);
      appliedOps.reverse();
      const nextOps = type.transform([op], appliedOps, "left");
      return nextOps[0];
    });
    expect(tfOps[0]).toEqual({ p: ["a", "b", 1], ld: 1 });
    expect(tfOps[1]).toEqual({ p: ["a", "b", 1], ld: 2 });
    expect(tfOps[2]).toEqual({ p: ["a", "b", 1], ld: 3 });
    expect(tfOps[3]).toEqual(undefined);
    const nextState = type.apply(baseState, tfOps.filter(Boolean));
    expect(nextState.a.b).toEqual([0, 4, 5, 6]);
  });

  it("transform local", () => {
    const ops: Op[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 2], ld: 2 },
      { p: ["a", "b", 3], ld: 3 },
      { p: ["a", "b", 3], ld: 3 },
    ];
    const transformLocal = (op1: Op, base: Op[], dir: "left" | "right"): Op => {
      let transformedOp = op1;
      const reversed = [...base].reverse();
      for (const op of reversed) {
        const [result] = type.transformComponent([], transformedOp, op, dir);
        if (!result) return result;
        transformedOp = result;
      }
      return transformedOp;
    };
    ops.forEach((op, index) => {
      const appliedOps = ops.slice(0, index);
      const a1 = transformLocal(op, appliedOps, "left");
      appliedOps.reverse();
      const b1 = type.transform([op], appliedOps, "left");
      expect(a1).toEqual(b1[0]);
    });
  });

  it("transform order", () => {
    const ops: Op[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 3], ld: 3 },
      { p: ["a", "b", 2], ld: 2 },
      { p: ["a", "b", 3], ld: 3 },
    ];
    const tfOps = ops.map((op, index) => {
      const appliedOps = ops.slice(0, index);
      appliedOps.reverse();
      const nextOps = type.transform([op], appliedOps, "left");
      return nextOps[0];
    });
    expect(tfOps[0]).toEqual({ p: ["a", "b", 1], ld: 1 });
    expect(tfOps[1]).toEqual({ p: ["a", "b", 2], ld: 3 });
    expect(tfOps[2]).toEqual({ p: ["a", "b", 1], ld: 2 });
    // 这里是存在问题的 希望得到的结果是 undefined
    expect(tfOps[3]).toEqual({ p: ["a", "b", 1], ld: 3 });
  });

  it("transform post", () => {
    const ops: Op[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 3], ld: 3 },
      { p: ["a", "b", 2], ld: 2 },
      { p: ["a", "b", 3], ld: 3 },
    ];
    const copied: Op[] = [...ops];
    const len = copied.length;
    for (let i = 0; i < len; i++) {
      // 这里是 copied 而不是 ops, 是应用后的操作
      // 否则会导致实际轮转的操作变换产生错误
      // 例如 [1,2,3] 下会出现 [1,1,undefined] 的情况
      const base = copied[i];
      for (let k = i + 1; k < len; k++) {
        const op = copied[k];
        if (!op) continue;
        const nextOp = type.transformComponent([], op, base, "left");
        copied[k] = nextOp[0];
      }
    }
    expect(copied[0]).toEqual({ p: ["a", "b", 1], ld: 1 });
    expect(copied[1]).toEqual({ p: ["a", "b", 2], ld: 3 });
    expect(copied[2]).toEqual({ p: ["a", "b", 1], ld: 2 });
    expect(copied[3]).toEqual(undefined);
  });

  it.only("transform ref", () => {
    const baseState = {
      a: {
        b: [0, 1, 2, 3, 4, 5, 6] as number[],
      },
    };
    // 持有且变换后的操作 目的是变换 path
    // 例如如果是 ld 的话 则应该先变换 [5,6] => [5,5]
    const refOps: Op[] = [
      { p: ["a", "b", 5, "attrs"], od: "k", oi: "v" },
      { p: ["a", "b", 6, "attrs"], od: "k1", oi: "v1" },
    ];
    const apply = (snapshot: typeof baseState, ops: Op[]) => {
      for (let i = 0, n = ops.length; i < n; ++i) {
        const tfOp = ops[i];
        if (!tfOp) continue;
        // 变换出可直接应用的 ops 后, ref module 可以持有按序变换
        for (let k = 0, n = refOps.length; k < n; ++k) {
          const refOp = refOps[k];
          if (!refOp) continue;
          const [result] = type.transformComponent([], refOp, tfOp, "left");
          refOps[k] = result;
        }
      }
      return type.apply(snapshot, ops);
    };
    const tfOps: Op[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 2], ld: 3 },
      { p: ["a", "b", 1], ld: 2 },
    ];
    const nextState = apply(baseState, tfOps);
    expect(nextState.a.b).toEqual([0, 4, 5, 6]);
    expect(refOps[0]).toEqual({ p: ["a", "b", 2, "attrs"], od: "k", oi: "v" });
    expect(refOps[1]).toEqual({ p: ["a", "b", 3, "attrs"], od: "k1", oi: "v1" });
  });
});
