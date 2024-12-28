import { createDraft, finishDraft, produce } from "immer";
import type { Op } from "ot-json0";
import json from "ot-json0";

describe("update", () => {
  it("immer", () => {
    const baseState = {
      a: {
        b: { c: 1 },
      },
      d: {
        e: 2,
      },
    };
    const nextState = produce(baseState, draft => {
      draft.a.b.c = 3;
    });
    expect(nextState.a.b.c).toBe(3);
    expect(nextState.a).not.toBe(baseState.a);
    expect(nextState.a.b).not.toBe(baseState.a.b);
    expect(nextState.d).toBe(baseState.d);
    expect(nextState.d.e).toBe(baseState.d.e);
  });

  it("ot-json", () => {
    const baseState = {
      a: {
        b: { c: 1 },
      },
      d: {
        e: 2,
      },
    };
    const draft = createDraft(baseState);
    const op: Op = {
      p: ["a", "b", "c"],
      // 应用时未校验, 但为了保证 invert 的正确性, 这里需要确定原始值
      // https://github.com/ottypes/json0/blob/master/lib/json0.js#L237
      od: 1,
      oi: 3,
    };
    json.type.apply(draft, [op]);
    const nextState = finishDraft(draft);
    expect(nextState.a.b.c).toBe(3);
    expect(nextState.a).not.toBe(baseState.a);
    expect(nextState.a.b).not.toBe(baseState.a.b);
    expect(nextState.d).toBe(baseState.d);
    expect(nextState.d.e).toBe(baseState.d.e);
  });
});
