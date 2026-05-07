export interface StockItem {
  product_id?: string | null;
  quantity: number;
}

/**
 * Returns a map of product_id -> delta (next - old). Items with null/undefined
 * product_id are ignored (manual line items don't track stock). Entries with
 * delta === 0 are omitted.
 */
export function computeStockDelta(
  oldItems: StockItem[],
  nextItems: StockItem[],
): Record<string, number> {
  const sumByProduct = (items: StockItem[]): Record<string, number> => {
    const totals: Record<string, number> = {};
    for (const item of items) {
      if (!item.product_id) continue;
      totals[item.product_id] = (totals[item.product_id] ?? 0) + item.quantity;
    }
    return totals;
  };

  const oldTotals = sumByProduct(oldItems);
  const nextTotals = sumByProduct(nextItems);

  const productIds = new Set([
    ...Object.keys(oldTotals),
    ...Object.keys(nextTotals),
  ]);

  const delta: Record<string, number> = {};
  for (const id of productIds) {
    const d = (nextTotals[id] ?? 0) - (oldTotals[id] ?? 0);
    if (d !== 0) delta[id] = d;
  }
  return delta;
}
