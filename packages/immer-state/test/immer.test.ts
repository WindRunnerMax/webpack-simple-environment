import { produce } from "immer";

describe("immer", () => {
  it("base", () => {
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
});
