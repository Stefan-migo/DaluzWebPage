export interface DiscountableItem {
  productId: string;
  price: number;
  quantity: number;
}

export interface TransferTotals {
  subtotal: number;
  discount: number;
  total: number;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Aplica el discount_transfer_percent de cada producto sobre su linea.
 *
 * Se ejecuta SIEMPRE en el servidor con porcentajes leidos de la base: si se
 * aceptara un total calculado en el navegador, cualquiera podria pedirse el
 * descuento que quisiera editando la request.
 */
export function calculateTransferDiscount(
  items: DiscountableItem[],
  percentByProductId: Record<string, number>,
): TransferTotals {
  let subtotal = 0;
  let discount = 0;

  for (const item of items) {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const percent = percentByProductId[item.productId];
    // Un porcentaje corrupto en la base no puede regalar ni encarecer productos.
    if (typeof percent === "number" && percent > 0 && percent <= 100) {
      discount += lineTotal * (percent / 100);
    }
  }

  subtotal = round2(subtotal);
  discount = round2(discount);

  return { subtotal, discount, total: round2(subtotal - discount) };
}
