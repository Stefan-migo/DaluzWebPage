import { describe, it, expect } from "vitest";
import { computeStockDelta } from "./orderStock";

describe("computeStockDelta", () => {
  it("returns empty map when items unchanged", () => {
    const old = [{ product_id: "p1", quantity: 2 }];
    const next = [{ product_id: "p1", quantity: 2 }];
    expect(computeStockDelta(old, next)).toEqual({});
  });

  it("computes positive delta when quantity increases", () => {
    const old = [{ product_id: "p1", quantity: 2 }];
    const next = [{ product_id: "p1", quantity: 5 }];
    expect(computeStockDelta(old, next)).toEqual({ p1: 3 });
  });

  it("computes negative delta when quantity decreases", () => {
    const old = [{ product_id: "p1", quantity: 5 }];
    const next = [{ product_id: "p1", quantity: 2 }];
    expect(computeStockDelta(old, next)).toEqual({ p1: -3 });
  });

  it("returns full negative delta when item removed", () => {
    const old = [{ product_id: "p1", quantity: 4 }];
    const next: Array<{ product_id: string; quantity: number }> = [];
    expect(computeStockDelta(old, next)).toEqual({ p1: -4 });
  });

  it("returns full positive delta when item added", () => {
    const old: Array<{ product_id: string; quantity: number }> = [];
    const next = [{ product_id: "p1", quantity: 3 }];
    expect(computeStockDelta(old, next)).toEqual({ p1: 3 });
  });

  it("ignores items with no product_id (manual)", () => {
    const old = [{ product_id: "p1", quantity: 2 }];
    const next = [
      { product_id: "p1", quantity: 2 },
      { product_id: null, quantity: 99 },
    ];
    expect(computeStockDelta(old, next)).toEqual({});
  });

  it("sums quantities when same product_id appears multiple times", () => {
    const old = [{ product_id: "p1", quantity: 1 }];
    const next = [
      { product_id: "p1", quantity: 2 },
      { product_id: "p1", quantity: 3 },
    ];
    expect(computeStockDelta(old, next)).toEqual({ p1: 4 });
  });

  it("handles multiple products independently", () => {
    const old = [
      { product_id: "p1", quantity: 2 },
      { product_id: "p2", quantity: 5 },
    ];
    const next = [
      { product_id: "p1", quantity: 3 },
      { product_id: "p2", quantity: 1 },
    ];
    expect(computeStockDelta(old, next)).toEqual({ p1: 1, p2: -4 });
  });
});
