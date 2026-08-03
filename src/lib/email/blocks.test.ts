import { describe, it, expect } from "vitest";
import { emailConfig } from "./client";
import {
  resolveEmailImageUrl,
  renderOrderItems,
  renderOrderTotals,
  renderShippingAddress,
  type EmailOrderItem,
  type EmailOrderTotals,
  type EmailShippingAddress,
} from "./blocks";

// emailConfig.domain se evalua al importar el modulo leyendo
// NEXT_PUBLIC_APP_URL. Derivamos el base de ahi en vez de hardcodearlo, para
// que el test no dependa del entorno de quien lo corre.
const BASE = emailConfig.domain.replace(/\/+$/, "");
const PLACEHOLDER = `${BASE}/images/email-placeholder.jpg`;

describe("resolveEmailImageUrl", () => {
  it("envuelve una URL absoluta en la ruta de miniaturas", () => {
    const out = resolveEmailImageUrl("https://xdvemk.supabase.co/serum.jpg");
    expect(out).toContain(`${BASE}/api/email/image?src=`);
    expect(out).toContain(
      encodeURIComponent("https://xdvemk.supabase.co/serum.jpg"),
    );
    expect(out).toContain("w=128");
  });

  it("convierte una ruta relativa en absoluta antes de envolverla", () => {
    const out = resolveEmailImageUrl("/images/producto.jpg");
    expect(out).toContain(encodeURIComponent(`${BASE}/images/producto.jpg`));
  });

  it("devuelve el placeholder para URLs file://", () => {
    expect(resolveEmailImageUrl("file:///C:/fotos/x.jpg")).toBe(PLACEHOLDER);
  });

  it("devuelve el placeholder para vacio, null y undefined", () => {
    expect(resolveEmailImageUrl("")).toBe(PLACEHOLDER);
    expect(resolveEmailImageUrl("   ")).toBe(PLACEHOLDER);
    expect(resolveEmailImageUrl(null)).toBe(PLACEHOLDER);
    expect(resolveEmailImageUrl(undefined)).toBe(PLACEHOLDER);
  });

  it("devuelve el placeholder para data: y blob:", () => {
    expect(resolveEmailImageUrl("data:image/png;base64,AAAA")).toBe(PLACEHOLDER);
    expect(resolveEmailImageUrl("blob:http://x/y")).toBe(PLACEHOLDER);
  });

  it("respeta el ancho pedido", () => {
    expect(
      resolveEmailImageUrl("https://xdvemk.supabase.co/serum.jpg", 64),
    ).toContain("w=64");
  });
});

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
