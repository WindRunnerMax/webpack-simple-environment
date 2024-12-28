import { createDraft, finishDraft, produce } from "immer";
import type { Op } from "ot-json0";
import json from "ot-json0";

describe("insert", () => {
  it("immer", () => {
    const baseState = {
      a: {
        b: [1] as number[],
      },
      d: {
        e: 2,
      },
    };
    const nextState = produce(baseState, draft => {
      draft.a.b.unshift(0);
    });
    expect(nextState.a.b[0]).toBe(0);
    expect(nextState.a.b[1]).toBe(1);
    expect(nextState.a).not.toBe(baseState.a);
    expect(nextState.a.b).not.toBe(baseState.a.b);
    expect(nextState.d).toBe(baseState.d);
    expect(nextState.d.e).toBe(baseState.d.e);
  });

  it("ot-json", () => {
    const baseState = {
      a: {
        b: [1] as number[],
      },
      d: {
        e: 2,
      },
    };
    const draft = createDraft(baseState);
    const op: Op = {
      p: ["a", "b", 0],
      li: 0,
    };
    json.type.apply(draft, [op]);
    const nextState = finishDraft(draft);
    expect(nextState.a.b[0]).toBe(0);
    expect(nextState.a.b[1]).toBe(1);
    expect(nextState.a).not.toBe(baseState.a);
    expect(nextState.a.b).not.toBe(baseState.a.b);
    expect(nextState.d).toBe(baseState.d);
    expect(nextState.d.e).toBe(baseState.d.e);
  });
});
