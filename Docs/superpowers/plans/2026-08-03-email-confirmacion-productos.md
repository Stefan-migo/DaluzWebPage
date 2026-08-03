# Email de confirmación con imágenes de producto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer el mail `order_confirmation` con miniaturas de producto, desglose de totales y dirección de envío, sirviendo las imágenes como JPEG liviano.

**Architecture:** El código genera bloques HTML ya renderizados (`{{order_items}}`, `{{order_totals}}`, `{{shipping_address}}`) que se inyectan en el template guardado en `email_templates.content`. Las miniaturas pasan por una ruta propia que normaliza formato y peso con `sharp`. La imagen del producto se congela en `order_items` al comprar.

**Tech Stack:** Next.js 14.2.35 (App Router, Route Handlers), Supabase, Resend `^2.1.0`, sharp `^0.35.3`, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-03-email-confirmacion-compra-design.md`

## Global Constraints

- Tests en `src/**/*.test.ts`. Vitest con `globals: true` y `environment: "node"` — no hace falta importar `describe`/`it`/`expect`.
- Correr tests: `npm test`. Typecheck: `npx tsc --noEmit`. Ambos deben pasar antes de cada commit.
- **HTML de correo:** solo `<table role="presentation" cellpadding="0" cellspacing="0" border="0">`. Prohibido `display:flex`, `display:grid`, `<style>` y `background-image`.
- Todo `<img>` lleva atributos `width` y `height` (no solo CSS) y `alt` no vacío.
- Ancho máximo del mail: 600px.
- Copy en español rioplatense. Moneda con `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })`.
- **El envío de mail nunca lanza excepción.** Devuelve `{ success, error }`. Un fallo de mail no puede romper una compra.
- La ruta `/api/email/image` nunca devuelve 5xx: ante cualquier fallo sirve el placeholder con 200.
- Rama de trabajo: `feat/email-confirmacion-productos`.

---

### Task 1: Congelar la imagen del producto en `order_items`

**Files:**
- Create: `supabase/migrations/20260803000000_add_product_image_to_order_items.sql`
- Modify: `src/lib/services/checkout.service.ts:92-102`
- Modify: `src/types/database.ts:522-546` (agregar `product_image` a Row/Insert/Update de `order_items`)

**Interfaces:**
- Consumes: nada.
- Produces: columna `order_items.product_image text | null`, poblada en cada compra nueva.

- [ ] **Step 1: Escribir la migración**

Crear `supabase/migrations/20260803000000_add_product_image_to_order_items.sql`:

```sql
-- Congela la imagen del producto al momento de la compra, con el mismo
-- criterio que ya se usa para product_name, variant_title y unit_price:
-- el pedido es un registro historico y no debe cambiar si despues se
-- edita o se da de baja el producto.
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image text;

-- Backfill best-effort para pedidos existentes: toma la imagen ACTUAL del
-- producto. No es la del momento de compra, pero es lo mejor disponible.
UPDATE order_items oi
SET product_image = p.featured_image
FROM products p
WHERE oi.product_id = p.id
  AND oi.product_image IS NULL;
```

- [ ] **Step 2: Agregar la columna a los tipos**

En `src/types/database.ts`, dentro de `order_items`, agregar `product_image` en los tres bloques:

```ts
// en Row:
          product_name: string;
          product_image: string | null;
// en Insert:
          product_name: string;
          product_image?: string | null;
// en Update:
          product_name?: string;
          product_image?: string | null;
```

- [ ] **Step 3: Guardar la imagen al crear los items**

En `src/lib/services/checkout.service.ts`, en `createOrderItems`, agregar la línea `product_image`. `CartItem` ya expone `image` (`src/contexts/CartContext.tsx:21`), así que no hace falta ningún lookup:

```ts
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      product_name: item.name,
      product_image: item.image || null,
      variant_title: item.size || null,
      sku: item.sku || null,
    }));
```

- [ ] **Step 4: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: exit 0, sin errores.

**Alcance deliberado:** existe un segundo punto de inserción de items, `src/lib/services/orders.service.ts:188-196`, usado solo por los pedidos manuales que crea un admin. Ese camino **no se toca**: sus items quedan con `product_image = null` y el mail les muestra el placeholder. Es aceptable porque son pedidos de carga manual, no compras de cliente. Si más adelante se quiere cubrir, hay que agregar la imagen al formulario de alta manual, que es otro trabajo.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260803000000_add_product_image_to_order_items.sql src/types/database.ts src/lib/services/checkout.service.ts
git commit -m "feat: congelar product_image en order_items al comprar"
```

---

### Task 2: Placeholder liviano y ruta de miniaturas JPEG

**Files:**
- Create: `public/images/email-placeholder.jpg`
- Create: `src/app/api/email/image/route.ts`
- Test: `src/app/api/email/image/route.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `GET /api/email/image?src=<url absoluta>&w=<number>` → JPEG. Exporta `isAllowedImageHost(url: string): boolean` para poder testearla.

- [ ] **Step 1: Generar el placeholder chico**

El placeholder actual `public/images/placeholder-product.jpg` pesa 2,9 MB — inaceptable para un mail. Generar uno de 128px:

```bash
node -e "require('sharp')('public/images/placeholder-product.jpg').resize(128,128,{fit:'cover'}).jpeg({quality:70}).toFile('public/images/email-placeholder.jpg').then(i=>console.log(i.size+' bytes'))"
```

Expected: imprime un tamaño menor a 15000 bytes.

- [ ] **Step 2: Escribir el test de la allowlist**

Crear `src/app/api/email/image/route.test.ts`:

```ts
import { isAllowedImageHost } from "./route";

describe("isAllowedImageHost", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xdvemk.supabase.co";
    process.env.NEXT_PUBLIC_APP_URL = "https://daluzconsciente.com";
  });

  it("acepta el host de supabase storage", () => {
    expect(
      isAllowedImageHost("https://xdvemk.supabase.co/storage/v1/object/public/x.jpg"),
    ).toBe(true);
  });

  it("acepta el dominio propio", () => {
    expect(isAllowedImageHost("https://daluzconsciente.com/images/x.jpg")).toBe(true);
  });

  it("rechaza un host externo", () => {
    expect(isAllowedImageHost("https://evil.example.com/x.jpg")).toBe(false);
  });

  it("rechaza direcciones internas (SSRF)", () => {
    expect(isAllowedImageHost("http://169.254.169.254/latest/meta-data/")).toBe(false);
    expect(isAllowedImageHost("http://localhost:3000/secret")).toBe(false);
  });

  it("rechaza una URL invalida sin lanzar", () => {
    expect(isAllowedImageHost("no-es-una-url")).toBe(false);
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `npm test -- src/app/api/email/image/route.test.ts`
Expected: FAIL — no existe el módulo `./route`.

- [ ] **Step 4: Implementar la ruta**

Crear `src/app/api/email/image/route.ts`:

```ts
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

const PLACEHOLDER_PATH = path.join(
  process.cwd(),
  "public",
  "images",
  "email-placeholder.jpg",
);

const CACHE_HEADERS = {
  "Content-Type": "image/jpeg",
  "Cache-Control": "public, max-age=31536000, immutable",
};

/**
 * Allowlist de hosts. Sin esto la ruta seria un open proxy: permitiria
 * alcanzar direcciones internas (SSRF) o usar el servidor como CDN gratis.
 */
export function isAllowedImageHost(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const allowed = new Set<string>();
  for (const envUrl of [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ]) {
    if (!envUrl) continue;
    try {
      allowed.add(new URL(envUrl).host);
    } catch {
      // env mal formada: se ignora
    }
  }

  return allowed.has(parsed.host);
}

async function placeholderResponse(): Promise<Response> {
  try {
    const file = await readFile(PLACEHOLDER_PATH);
    return new Response(new Uint8Array(file), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch {
    // Ultimo recurso: 1x1 transparente. Nunca un 5xx.
    return new Response(null, { status: 204 });
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");
  const width = Math.min(
    Math.max(parseInt(searchParams.get("w") || "128", 10) || 128, 16),
    600,
  );

  if (!src || !isAllowedImageHost(src)) return placeholderResponse();

  try {
    const upstream = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) return placeholderResponse();

    const input = Buffer.from(await upstream.arrayBuffer());
    const output = await sharp(input)
      .resize(width, width, { fit: "cover" })
      .jpeg({ quality: 72 })
      .toBuffer();

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch {
    return placeholderResponse();
  }
}
```

- [ ] **Step 5: Correr el test y verificar que pasa**

Run: `npm test -- src/app/api/email/image/route.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 6: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add public/images/email-placeholder.jpg src/app/api/email/image/route.ts src/app/api/email/image/route.test.ts
git commit -m "feat: ruta de miniaturas JPEG para mails con allowlist de hosts"
```

---

### Task 3: `resolveEmailImageUrl`

**Files:**
- Create: `src/lib/email/blocks.ts`
- Test: `src/lib/email/blocks.test.ts`

**Interfaces:**
- Consumes: `emailConfig.domain` de `src/lib/email/client.ts`; la ruta de Task 2.
- Produces: `resolveEmailImageUrl(url: string | null | undefined, width?: number): string`.

- [ ] **Step 1: Escribir el test**

Crear `src/lib/email/blocks.test.ts`:

**Ojo:** `emailConfig.domain` se evalúa al importar el módulo, leyendo `NEXT_PUBLIC_APP_URL`. Si el test hardcodeara `https://daluzconsciente.com` fallaría en cualquier máquina con esa variable apuntando a otro lado. Por eso el `BASE` se deriva del propio `emailConfig`.

```ts
import { emailConfig } from "./client";
import { resolveEmailImageUrl } from "./blocks";

const BASE = emailConfig.domain.replace(/\/+$/, "");

describe("resolveEmailImageUrl", () => {
  it("envuelve una URL absoluta en la ruta de miniaturas", () => {
    const out = resolveEmailImageUrl("https://xdvemk.supabase.co/x.jpg");
    expect(out).toContain(`${BASE}/api/email/image?src=`);
    expect(out).toContain(encodeURIComponent("https://xdvemk.supabase.co/x.jpg"));
    expect(out).toContain("w=128");
  });

  it("convierte una ruta relativa en absoluta antes de envolverla", () => {
    const out = resolveEmailImageUrl("/images/producto.jpg");
    expect(out).toContain(encodeURIComponent(`${BASE}/images/producto.jpg`));
  });

  it("devuelve el placeholder para URLs file://", () => {
    expect(resolveEmailImageUrl("file:///C:/fotos/x.jpg")).toBe(
      `${BASE}/images/email-placeholder.jpg`,
    );
  });

  it("devuelve el placeholder para vacio, null y undefined", () => {
    const ph = `${BASE}/images/email-placeholder.jpg`;
    expect(resolveEmailImageUrl("")).toBe(ph);
    expect(resolveEmailImageUrl("   ")).toBe(ph);
    expect(resolveEmailImageUrl(null)).toBe(ph);
    expect(resolveEmailImageUrl(undefined)).toBe(ph);
  });

  it("devuelve el placeholder para data: y blob:", () => {
    const ph = `${BASE}/images/email-placeholder.jpg`;
    expect(resolveEmailImageUrl("data:image/png;base64,AAAA")).toBe(ph);
    expect(resolveEmailImageUrl("blob:http://x/y")).toBe(ph);
  });

  it("respeta el ancho pedido", () => {
    expect(resolveEmailImageUrl("https://xdvemk.supabase.co/x.jpg", 64)).toContain("w=64");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/lib/email/blocks.test.ts`
Expected: FAIL — no existe `./blocks`.

- [ ] **Step 3: Implementar**

Crear `src/lib/email/blocks.ts`:

```ts
import { emailConfig } from "./client";

const PLACEHOLDER_PATH = "/images/email-placeholder.jpg";

function siteBase(): string {
  return emailConfig.domain.replace(/\/+$/, "");
}

/**
 * Devuelve una URL de imagen apta para correo: absoluta, publica y servida
 * como JPEG liviano por /api/email/image.
 *
 * El saneo ocurre aca y no al guardar: en la base guardamos la URL cruda,
 * asi que si manana mejora el criterio no hay filas viejas envenenadas.
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
    // file://, data:, blob:, rutas de Windows, cualquier otra cosa
    return placeholder;
  }

  return `${base}/api/email/image?src=${encodeURIComponent(absolute)}&w=${width}`;
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test -- src/lib/email/blocks.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/blocks.ts src/lib/email/blocks.test.ts
git commit -m "feat: resolveEmailImageUrl con saneo de URLs para correo"
```

---

### Task 4: `renderOrderItems`

**Files:**
- Modify: `src/lib/email/blocks.ts`
- Modify: `src/lib/email/blocks.test.ts`

**Interfaces:**
- Consumes: `resolveEmailImageUrl` de Task 3.
- Produces:
  - `export interface EmailOrderItem { name: string; quantity: number; price: number; variant_title?: string | null; product_image?: string | null; }`
  - `renderOrderItems(items: EmailOrderItem[]): string`

- [ ] **Step 1: Escribir el test**

Agregar a `src/lib/email/blocks.test.ts`:

```ts
import { renderOrderItems, type EmailOrderItem } from "./blocks";

const items: EmailOrderItem[] = [
  {
    name: "Serum Facial Claridad",
    quantity: 2,
    price: 13000,
    variant_title: "30ml",
    product_image: "https://xdvemk.supabase.co/serum.jpg",
  },
  { name: "Pocima Agni", quantity: 1, price: 22000, product_image: null },
];

describe("renderOrderItems", () => {
  it("usa tablas y nunca flex", () => {
    const html = renderOrderItems(items);
    expect(html).toContain("<table");
    expect(html).not.toContain("display:flex");
    expect(html).not.toContain("display: flex");
  });

  it("incluye nombre, variante y cantidad", () => {
    const html = renderOrderItems(items);
    expect(html).toContain("Serum Facial Claridad");
    expect(html).toContain("30ml");
    expect(html).toContain("x2");
  });

  it("calcula el total de linea", () => {
    const html = renderOrderItems(items);
    expect(html).toContain("26.000");
  });

  it("toda imagen lleva width, height y alt no vacio", () => {
    const html = renderOrderItems(items);
    const imgs = html.match(/<img[^>]*>/g) || [];
    expect(imgs).toHaveLength(2);
    for (const img of imgs) {
      expect(img).toMatch(/\swidth="\d+"/);
      expect(img).toMatch(/\sheight="\d+"/);
      expect(img).toMatch(/\salt="[^"]+"/);
    }
  });

  it("usa el placeholder cuando el item no tiene imagen", () => {
    const html = renderOrderItems([items[1]]);
    expect(html).toContain("/images/email-placeholder.jpg");
  });

  it("escapa HTML en el nombre del producto", () => {
    const html = renderOrderItems([
      { name: '<script>alert("x")</script>', quantity: 1, price: 100 },
    ]);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("devuelve string vacio sin items", () => {
    expect(renderOrderItems([])).toBe("");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/lib/email/blocks.test.ts`
Expected: FAIL — `renderOrderItems` no está exportado.

- [ ] **Step 3: Implementar**

Agregar a `src/lib/email/blocks.ts`:

```ts
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
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test -- src/lib/email/blocks.test.ts`
Expected: PASS, 13 tests (6 de Task 3 + 7 nuevos).

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/blocks.ts src/lib/email/blocks.test.ts
git commit -m "feat: renderOrderItems con miniaturas y HTML apto para correo"
```

---

### Task 5: `renderOrderTotals` y `renderShippingAddress`

**Files:**
- Modify: `src/lib/email/blocks.ts`
- Modify: `src/lib/email/blocks.test.ts`

**Interfaces:**
- Consumes: `formatARS` y `escapeHtml` de Task 4 (privadas del módulo).
- Produces:
  - `export interface EmailOrderTotals { subtotal: number; shipping_amount: number; discount_amount?: number | null; total_amount: number; }`
  - `renderOrderTotals(totals: EmailOrderTotals): string`
  - `export interface EmailShippingAddress { shipping_name?: string | null; shipping_address?: string | null; shipping_city?: string | null; shipping_state?: string | null; shipping_postal_code?: string | null; }`
  - `renderShippingAddress(address: EmailShippingAddress): string`

- [ ] **Step 1: Escribir el test**

Agregar a `src/lib/email/blocks.test.ts`:

```ts
import {
  renderOrderTotals,
  renderShippingAddress,
  type EmailOrderTotals,
  type EmailShippingAddress,
} from "./blocks";

describe("renderOrderTotals", () => {
  const base: EmailOrderTotals = {
    subtotal: 48000,
    shipping_amount: 5000,
    discount_amount: 0,
    total_amount: 53000,
  };

  it("muestra subtotal y total", () => {
    const html = renderOrderTotals(base);
    expect(html).toContain("Subtotal");
    expect(html).toContain("48.000");
    expect(html).toContain("Total");
    expect(html).toContain("53.000");
  });

  it("omite la fila de descuento cuando es cero", () => {
    expect(renderOrderTotals(base)).not.toContain("Descuento");
  });

  it("muestra la fila de descuento cuando hay descuento", () => {
    const html = renderOrderTotals({ ...base, discount_amount: 4000 });
    expect(html).toContain("Descuento");
    expect(html).toContain("4.000");
  });

  it("muestra 'Gratis' cuando el envio es cero", () => {
    const html = renderOrderTotals({ ...base, shipping_amount: 0 });
    expect(html).toContain("Gratis");
  });

  it("usa tablas y no flex", () => {
    const html = renderOrderTotals(base);
    expect(html).toContain("<table");
    expect(html).not.toContain("display:flex");
  });
});

describe("renderShippingAddress", () => {
  const full: EmailShippingAddress = {
    shipping_name: "Ana Perez",
    shipping_address: "Av. Siempreviva 742",
    shipping_city: "Córdoba",
    shipping_state: "Córdoba",
    shipping_postal_code: "5000",
  };

  it("incluye todos los campos de la direccion", () => {
    const html = renderShippingAddress(full);
    expect(html).toContain("Ana Perez");
    expect(html).toContain("Av. Siempreviva 742");
    expect(html).toContain("Córdoba");
    expect(html).toContain("5000");
  });

  it("devuelve string vacio si no hay direccion", () => {
    expect(renderShippingAddress({})).toBe("");
    expect(renderShippingAddress({ shipping_address: null })).toBe("");
  });

  it("escapa HTML", () => {
    const html = renderShippingAddress({
      ...full,
      shipping_name: '<img src=x onerror="alert(1)">',
    });
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/lib/email/blocks.test.ts`
Expected: FAIL — `renderOrderTotals` no está exportado.

- [ ] **Step 3: Implementar**

Agregar a `src/lib/email/blocks.ts`:

```ts
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
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test -- src/lib/email/blocks.test.ts`
Expected: PASS, 21 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/blocks.ts src/lib/email/blocks.test.ts
git commit -m "feat: bloques de totales y direccion de envio para el mail"
```

---

### Task 6: Cablear los bloques en el envío y arreglar el texto plano

**Files:**
- Modify: `src/lib/email/notifications.ts:93-136`

**Interfaces:**
- Consumes: `renderOrderItems`, `renderOrderTotals`, `renderShippingAddress`, `EmailOrderItem` de Tasks 4 y 5.
- Produces: variables `{{order_items}}`, `{{order_totals}}` y `{{shipping_address}}` disponibles para el template.

- [ ] **Step 1: Extender la interfaz `Order`**

En `src/lib/email/notifications.ts`, agregar a `interface Order` los campos que hoy no declara (ya existen en la tabla `orders`):

```ts
  subtotal?: number
  shipping_amount?: number
  discount_amount?: number | null
  shipping_name?: string | null
  shipping_address?: string | null
  shipping_city?: string | null
  shipping_state?: string | null
  shipping_postal_code?: string | null
```

Y agregar `product_image` a los items:

```ts
  order_items?: Array<{
    product_name?: string
    name?: string
    quantity: number
    unit_price?: number
    price?: number
    variant_title?: string
    product_image?: string | null
  }>
```

- [ ] **Step 2: Reemplazar el armado de variables**

En `sendOrderConfirmation`, reemplazar el bloque que va desde `const orderItemsHTML = ...` hasta el cierre de `const variables = {...}` por:

```ts
      const normalisedItems: EmailOrderItem[] = rawItems.map((item) => ({
        name: item.name ?? item.product_name ?? "Producto",
        quantity: item.quantity,
        price: item.price ?? item.unit_price ?? 0,
        variant_title: item.variant_title,
        product_image: item.product_image,
      }));

      const orderItemsHTML = renderOrderItems(normalisedItems);
      const orderItemsText = formatOrderItemsText(normalisedItems);

      const subtotal =
        order.subtotal ??
        normalisedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

      const orderTotalsHTML = renderOrderTotals({
        subtotal,
        shipping_amount: order.shipping_amount ?? 0,
        discount_amount: order.discount_amount ?? 0,
        total_amount: order.total_amount,
      });

      const shippingAddressHTML = renderShippingAddress({
        shipping_name: order.shipping_name,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_postal_code: order.shipping_postal_code,
      });

      const variables = {
        ...getDefaultVariables(),
        customer_name: order.customer_name || 'Cliente',
        order_number: order.order_number,
        order_date: orderDate,
        order_total: formatCurrency(order.total_amount),
        order_items: orderItemsHTML,
        order_totals: orderTotalsHTML,
        shipping_address: shippingAddressHTML,
        payment_method: getPaymentMethodLabel(order.payment_method),
        order_items_text: orderItemsText
      };
```

Agregar el import arriba del archivo:

```ts
import {
  renderOrderItems,
  renderOrderTotals,
  renderShippingAddress,
  type EmailOrderItem,
} from './blocks'
```

- [ ] **Step 3: Ampliar la firma de `formatOrderItemsText`**

`EmailOrderItem.variant_title` es `string | null | undefined`, pero `formatOrderItemsText` (en `src/lib/email/template-utils.ts:77-82`) declara `variant_title?: string`. Pasarle `null` **no compila**. Ampliar la firma en `template-utils.ts`:

```ts
export function formatOrderItemsText(
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant_title?: string | null;
  }>,
): string {
```

El cuerpo no cambia: ya usa `item.variant_title ? ... : ...`, que trata `null` igual que `undefined`.

- [ ] **Step 4: Construir el texto plano explícitamente**

Reemplazar el bloque que genera `text` arrancando etiquetas con regex (líneas ~125-129) por una construcción desde los datos. Arrancar etiquetas de una tabla produce un choclo ilegible y baja el puntaje anti-spam:

```ts
      const addressText = order.shipping_address
        ? [
            order.shipping_name,
            order.shipping_address,
            [order.shipping_city, order.shipping_state].filter(Boolean).join(", "),
            order.shipping_postal_code ? `CP ${order.shipping_postal_code}` : null,
          ]
            .filter(Boolean)
            .join("\n")
        : "";

      const text = [
        `Hola ${order.customer_name || "Cliente"},`,
        ``,
        `Recibimos tu pedido ${order.order_number} del ${orderDate}.`,
        ``,
        `PRODUCTOS`,
        orderItemsText,
        ``,
        `Subtotal: ${formatCurrency(subtotal)}`,
        `Envío: ${(order.shipping_amount ?? 0) > 0 ? formatCurrency(order.shipping_amount!) : "Gratis"}`,
        (order.discount_amount ?? 0) > 0
          ? `Descuento: - ${formatCurrency(order.discount_amount!)}`
          : null,
        `Total: ${formatCurrency(order.total_amount)}`,
        addressText ? `` : null,
        addressText ? `ENVÍO A` : null,
        addressText || null,
        ``,
        `Gracias por tu compra.`,
      ]
        .filter((line) => line !== null)
        .join("\n");
```

- [ ] **Step 5: Verificar tipos y tests**

Run: `npx tsc --noEmit && npm test`
Expected: exit 0 y todos los tests en verde.

- [ ] **Step 6: Commit**

```bash
git add src/lib/email/notifications.ts src/lib/email/template-utils.ts
git commit -m "feat: cablear bloques ricos y texto plano real en la confirmacion"
```

---

### Task 7: Actualizar el template `order_confirmation`

**Files:**
- Create: `supabase/migrations/20260803000001_update_order_confirmation_template.sql`

**Interfaces:**
- Consumes: las variables `{{order_items}}`, `{{order_totals}}` y `{{shipping_address}}` de Task 6.
- Produces: template en base actualizado. Fin del plan.

- [ ] **Step 1: Escribir la migración**

Crear `supabase/migrations/20260803000001_update_order_confirmation_template.sql`:

```sql
-- Actualiza el template de confirmacion para usar los bloques nuevos.
-- {{order_items}} conserva el nombre a proposito: el template viejo no se
-- rompe, solo empieza a renderizar contenido mas rico.
UPDATE email_templates
SET content = '<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#faf7f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f2;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border-collapse:collapse;">
          <tr>
            <td style="padding:28px 32px 12px 32px;">
              <h1 style="margin:0;font-size:22px;color:#051341;">¡Gracias por tu compra, {{customer_name}}!</h1>
              <p style="margin:10px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
                Recibimos tu pedido <strong>{{order_number}}</strong> del {{order_date}}.
                Te avisamos por mail cuando lo despachemos.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <h2 style="margin:16px 0 4px 0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#051341;">Productos</h2>
              {{order_items}}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0 32px;">
              {{order_totals}}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0 32px;">
              <h2 style="margin:0 0 8px 0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#051341;">Envío a</h2>
              {{shipping_address}}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px 32px;">
              <p style="margin:0;font-size:13px;color:#6b6b6b;line-height:1.5;">
                Método de pago: {{payment_method}}<br />
                Si tenés alguna duda respondé este mail y te contestamos.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
    updated_at = now()
WHERE type = ''order_confirmation'';
```

**Nota para quien implemente:** en PostgreSQL las comillas simples dentro de un literal se escapan duplicándolas. El HTML de arriba no contiene comillas simples (se usan comillas dobles en todos los atributos), así que solo hay que duplicarlas en `''order_confirmation''`. Si al aplicar la migración PostgreSQL se queja de sintaxis, revisar que no se haya colado ningún apóstrofe en el copy.

- [ ] **Step 2: Aplicar la migración localmente**

Run: `npx supabase db reset` (o aplicar la migración contra la base de desarrollo)
Expected: sin errores de sintaxis SQL.

- [ ] **Step 3: Verificación end-to-end en cliente real**

Esto no lo cubre ningún test unitario. Desde el panel de administración, usar el endpoint de prueba existente:

```
POST /api/admin/system/email-templates/<id>/test
```

Enviar a **una casilla de Gmail y una de Outlook**. Verificar en cada una:
- Las miniaturas se ven (no huecos rotos).
- Las filas de productos están alineadas, no apiladas.
- Con imágenes bloqueadas, se lee el nombre del producto en el `alt`.
- El desglose de totales y la dirección aparecen.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260803000001_update_order_confirmation_template.sql
git commit -m "feat: template de confirmacion con bloques de productos, totales y envio"
```

---

## Notas de verificación final

Después de la Task 7, correr la suite completa:

```bash
npx tsc --noEmit && npm test
```

**Límite conocido:** los tests unitarios verifican que se genera el HTML pretendido, **no que se vea bien en Gmail o en Outlook**. La Task 7 Step 3 es la única verificación real de eso y no se puede saltear.
