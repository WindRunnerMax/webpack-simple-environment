import type { Op } from "ot-json0";
import { type } from "ot-json0";

describe("transform", () => {
  it("simple insert", () => {
    const base: Op[] = [{ p: [1] }];
    const op: Op[] = [{ p: [0], li: 1 }];
    const tf = type.transform(base, op, "left");
    expect(tf).toEqual([{ p: [2] }]);
  });

  it("simple delete", () => {
    const base: Op[] = [{ p: [1] }];
    const op: Op[] = [{ p: [0], ld: 1 }];
    const tf = type.transform(base, op, "left");
    expect(tf).toEqual([{ p: [0] }]);
  });

  it("simple retain", () => {
    const base: Op[] = [{ p: [1] }];
    const op: Op[] = [{ p: [1, "key"], oi: "value" }];
    const tf = type.transform(base, op, "left");
    expect(tf).toEqual([{ p: [1] }]);
  });
});
