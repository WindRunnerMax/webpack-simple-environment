import type { Op } from "ot-json0";
import { type } from "ot-json0";

describe("invert", () => {
  it("simple insert", () => {
    const op: Op[] = [{ p: [0], li: 1 }];
    const inverted = type.invert(op);
    expect(inverted).toEqual([{ p: [0], ld: 1 }]);
  });

  it("simple delete", () => {
    const op: Op[] = [{ p: [0], ld: 1 }];
    const inverted = type.invert(op);
    expect(inverted).toEqual([{ p: [0], li: 1 }]);
  });

  it("simple retain", () => {
    const op: Op[] = [{ p: [1, "key"], oi: "value" }];
    const inverted = type.invert(op);
    expect(inverted).toEqual([{ p: [1, "key"], od: "value" }]);
  });
});
