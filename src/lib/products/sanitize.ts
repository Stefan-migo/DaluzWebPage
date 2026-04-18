const NUMERIC_FIELDS = [
  "price",
  "compare_at_price",
  "cost_price",
  "weight",
  "inventory_quantity",
  "low_stock_threshold",
  "shelf_life_months",
  "discount_transfer_percent",
  "discount_cash_percent",
] as const;

const NULLABLE_TEXT_FIELDS = [
  "short_description",
  "description",
  "sku",
  "barcode",
  "featured_image",
  "video_url",
  "usage_instructions",
  "precautions",
  "package_characteristics",
  "meta_title",
  "meta_description",
  "category_id",
  "access_id",
  "promotional_tag",
  "published_at",
] as const;

const NON_WRITABLE_FIELDS = [
  "id",
  "created_at",
  "updated_at",
  "categories",
  "product_variants",
];

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
};

const normalizeDimensions = (value: unknown): unknown => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      return { raw: trimmed };
    }
  }
  return null;
};

export function sanitizeProductPayload(
  body: Record<string, any>,
): Record<string, any> {
  const output: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (NON_WRITABLE_FIELDS.includes(key)) continue;
    output[key] = value;
  }

  for (const field of NUMERIC_FIELDS) {
    if (field in output) output[field] = toNumberOrNull(output[field]);
  }

  for (const field of NULLABLE_TEXT_FIELDS) {
    if (field in output && output[field] === "") output[field] = null;
  }

  if ("dimensions" in output) {
    output.dimensions = normalizeDimensions(output.dimensions);
  }

  if (output.price === null) output.price = 0;
  if (output.inventory_quantity === null) output.inventory_quantity = 0;

  return output;
}
