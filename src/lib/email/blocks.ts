import { emailConfig } from "./client";

const PLACEHOLDER_PATH = "/images/email-placeholder.jpg";

function siteBase(): string {
  return emailConfig.domain.replace(/\/+$/, "");
}

/**
 * Devuelve una URL de imagen apta para correo: absoluta, publica y servida
 * como JPEG liviano por /api/email/image.
 *
 * El saneo ocurre aca y no al guardar: en la base guardamos la URL cruda, asi
 * que si manana mejora el criterio no quedan filas viejas envenenadas.
 */
export function resolveEmailImageUrl(
  url: string | null | undefined,
  width = 128,
): string {
  const base = siteBase();
  const placeholder = `${base}${PLACEHOLDER_PATH}`;

  if (!url) return placeholder;
  const trimmed = url.trim();
  if (!trimmed) return placeholder;

  let absolute: string;
  if (trimmed.startsWith("/")) {
    absolute = `${base}${trimmed}`;
  } else if (/^https?:\/\//i.test(trimmed)) {
    absolute = trimmed;
  } else {
    // file://, data:, blob:, rutas de Windows, cualquier otra cosa.
    return placeholder;
  }

  return `${base}/api/email/image?src=${encodeURIComponent(absolute)}&w=${width}`;
}

export interface EmailOrderItem {
  name: string;
  quantity: number;
  price: number;
  variant_title?: string | null;
  product_image?: string | null;
}

function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

/** Escapa HTML: los nombres de producto vienen de la base y entran al mail. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Filas de producto del mail. Tablas y no flex: Outlook ignora flex por
 * completo y las filas se apilan mal.
 */
export function renderOrderItems(items: EmailOrderItem[]): string {
  if (!items.length) return "";

  const rows = items
    .map((item) => {
      const name = escapeHtml(item.name || "Producto");
      const variant = item.variant_title
        ? `<div style="font-size:13px;color:#6b6b6b;margin-top:2px;">${escapeHtml(item.variant_title)}</div>`
        : "";
      const image = resolveEmailImageUrl(item.product_image, 128);
      const lineTotal = formatARS(item.price * item.quantity);
      const unit = formatARS(item.price);

      // width/height como atributos, no solo CSS: Outlook ignora el CSS de
      // dimensiones. El alt lleva el nombre porque muchos clientes bloquean
      // imagenes y es lo unico que el cliente va a leer.
      return `
      <tr>
        <td style="padding:12px 0;width:76px;vertical-align:top;">
          <img src="${image}" alt="${name}" width="64" height="64" style="display:block;border-radius:4px;border:1px solid #eee;" />
        </td>
        <td style="padding:12px 0;vertical-align:top;">
          <div style="font-size:15px;color:#051341;font-weight:600;">${name}</div>
          ${variant}
          <div style="font-size:13px;color:#6b6b6b;margin-top:4px;">x${item.quantity} &middot; ${unit} c/u</div>
        </td>
        <td style="padding:12px 0;text-align:right;vertical-align:top;font-size:15px;color:#051341;font-weight:600;white-space:nowrap;">
          ${lineTotal}
        </td>
      </tr>`;
    })
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">${rows}</table>`;
}

export interface EmailOrderTotals {
  subtotal: number;
  shipping_amount: number;
  discount_amount?: number | null;
  total_amount: number;
}

export function renderOrderTotals(totals: EmailOrderTotals): string {
  const row = (label: string, value: string, strong = false) => {
    const weight = strong ? "700" : "400";
    const size = strong ? "17px" : "14px";
    const border = strong ? "border-top:2px solid #051341;" : "";
    return `
      <tr>
        <td style="padding:6px 0;${border}font-size:${size};color:#051341;font-weight:${weight};">${label}</td>
        <td style="padding:6px 0;${border}font-size:${size};color:#051341;font-weight:${weight};text-align:right;white-space:nowrap;">${value}</td>
      </tr>`;
  };

  const discount = totals.discount_amount ?? 0;

  // El envio en cero se muestra como "Gratis": es informacion que el cliente
  // quiere ver, no una fila para omitir. El descuento en cero si se omite.
  const rows = [
    row("Subtotal", formatARS(totals.subtotal)),
    row(
      "Envío",
      totals.shipping_amount > 0 ? formatARS(totals.shipping_amount) : "Gratis",
    ),
    discount > 0 ? row("Descuento", `- ${formatARS(discount)}`) : "",
    row("Total", formatARS(totals.total_amount), true),
  ].join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">${rows}</table>`;
}

export interface EmailShippingAddress {
  shipping_name?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
}

export function renderShippingAddress(address: EmailShippingAddress): string {
  // Sin calle no hay direccion util: se omite el bloque entero en vez de
  // renderizar una caja vacia.
  if (!address.shipping_address) return "";

  const line2 = [address.shipping_city, address.shipping_state]
    .filter(Boolean)
    .map((v) => escapeHtml(String(v)))
    .join(", ");

  const postal = address.shipping_postal_code
    ? ` (CP ${escapeHtml(address.shipping_postal_code)})`
    : "";

  const name = address.shipping_name
    ? `<div style="font-weight:600;color:#051341;">${escapeHtml(address.shipping_name)}</div>`
    : "";

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:12px 16px;background-color:#fff2db;font-size:14px;color:#051341;line-height:1.5;">
        ${name}
        <div>${escapeHtml(address.shipping_address)}</div>
        <div>${line2}${postal}</div>
      </td>
    </tr>
  </table>`;
}
