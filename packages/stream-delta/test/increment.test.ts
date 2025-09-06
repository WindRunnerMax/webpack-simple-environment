import { Delta } from "@block-kit/delta";

import { DeltaComposer } from "../src/modules/delta-composer";
import { getContentChangeFragment } from "../src/utils/delta";

describe("increment delta", () => {
  it("insert left border", () => {
    const dc = new DeltaComposer();
    dc.archiveIndex = 10;
    dc.current = new Delta().insert("test");
    const changes = new Delta().retain(4).insert("i");
    const res = getContentChangeFragment(changes, dc);
    expect(res.changeLength).toBe(1);
    expect(res.delta.ops).toEqual([]);
  });

  it("insert right border", () => {
    const dc = new DeltaComposer();
    dc.archiveIndex = 10;
    dc.current = new Delta().insert("test");
    const changes = new Delta().retain(12).insert("i");
    const res = getContentChangeFragment(changes, dc);
    expect(res.changeLength).toBe(0);
    expect(res.delta.ops).toEqual([{ retain: 2 }, { insert: "i" }]);
  });

  it("delete left border", () => {
    const dc = new DeltaComposer();
    dc.archiveIndex = 10;
    dc.current = new Delta().insert("test");
    const changes = new Delta().retain(4).delete(1);
    const res = getContentChangeFragment(changes, dc);
    expect(res.changeLength).toBe(-1);
    expect(res.delta.ops).toEqual([]);
  });

  it("delete right border", () => {
    const dc = new DeltaComposer();
    dc.archiveIndex = 10;
    dc.current = new Delta().insert("test");
    const changes = new Delta().retain(12).delete(1);
    const res = getContentChangeFragment(changes, dc);
    expect(res.changeLength).toBe(0);
    expect(res.delta.ops).toEqual([{ retain: 2 }, { delete: 1 }]);
  });

  it("insert with delete", () => {
    const dc = new DeltaComposer();
    dc.archiveIndex = 10;
    dc.current = new Delta().insert("test");
    const changes = new Delta().retain(2).insert("1").retain(10).delete(1);
    const res = getContentChangeFragment(changes, dc);
    expect(res.changeLength).toBe(1);
    expect(res.delta.ops).toEqual([{ retain: 2 }, { delete: 1 }]);
  });
});
