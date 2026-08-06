import { describe, it, expect } from "vitest";
import { calculateTransferDiscount } from "./transfer-discount";

const items = [
  { productId: "a", price: 10000, quantity: 2 },
  { productId: "b", price: 5000, quantity: 1 },
];

describe("calculateTransferDiscount", () => {
  it("sin porcentajes no descuenta nada", () => {
    expect(calculateTransferDiscount(items, {})).toEqual({
      subtotal: 25000,
      discount: 0,
      total: 25000,
    });
  });

  it("aplica el porcentaje de cada producto", () => {
    // a: 20000 * 10% = 2000 | b: 5000 * 20% = 1000
    expect(calculateTransferDiscount(items, { a: 10, b: 20 })).toEqual({
      subtotal: 25000,
      discount: 3000,
      total: 22000,
    });
  });

  it("aplica solo a los productos que tienen porcentaje", () => {
    expect(calculateTransferDiscount(items, { a: 10 })).toEqual({
      subtotal: 25000,
      discount: 2000,
      total: 23000,
    });
  });

  it("carrito vacio da todo en cero", () => {
    expect(calculateTransferDiscount([], { a: 10 })).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
    });
  });

  it("redondea a dos decimales", () => {
    const out = calculateTransferDiscount(
      [{ productId: "a", price: 3333.33, quantity: 1 }],
      { a: 15 },
    );
    expect(out.discount).toBe(500);
    expect(out.total).toBe(2833.33);
  });

  it("ignora porcentajes fuera de rango", () => {
    expect(calculateTransferDiscount(items, { a: 150, b: -5 }).discount).toBe(0);
  });
});
