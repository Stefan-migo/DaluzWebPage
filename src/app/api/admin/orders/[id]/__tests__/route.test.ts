import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks for module-level dependencies. Must be declared before the dynamic import below.
const requireAdminMock = vi.fn();
const getServiceClientMock = vi.fn();

vi.mock("@/lib/auth/helpers", () => ({
  requireAdmin: () => requireAdminMock(),
  getServiceClient: () => getServiceClientMock(),
}));

vi.mock("@/lib/email/notifications", () => ({
  EmailNotificationService: {
    sendShippingNotification: vi.fn(),
    sendDeliveryConfirmation: vi.fn(),
  },
}));

// Build a chainable Supabase client mock. Each table method returns a fresh thenable.
type CallLog = {
  table: string;
  op: string;
  payload?: any;
  filters: Array<[string, any]>;
};

function makeSupabaseMock(setup: (table: string, op: string, single: boolean) => any) {
  const calls: CallLog[] = [];
  const from = vi.fn((table: string) => {
    const builder: any = {};
    let currentOp = "select";
    let isSingle = false;
    const filters: Array<[string, any]> = [];

    const finalize = () => setup(table, currentOp, isSingle);

    builder.select = vi.fn(() => {
      currentOp = "select";
      return builder;
    });
    builder.update = vi.fn((payload: any) => {
      currentOp = "update";
      calls.push({ table, op: "update", payload, filters });
      return builder;
    });
    builder.insert = vi.fn((payload: any) => {
      currentOp = "insert";
      calls.push({ table, op: "insert", payload, filters });
      return builder;
    });
    builder.delete = vi.fn(() => {
      currentOp = "delete";
      calls.push({ table, op: "delete", payload: undefined, filters });
      return builder;
    });
    builder.eq = vi.fn((col: string, val: any) => {
      filters.push([col, val]);
      return builder;
    });
    builder.in = vi.fn((col: string, vals: any[]) => {
      filters.push([col, vals]);
      return builder;
    });
    builder.single = vi.fn(() => {
      isSingle = true;
      return Promise.resolve(finalize());
    });
    builder.then = (resolve: (v: any) => void) => resolve(finalize());

    return builder;
  });

  return { from, calls };
}

function makeRequest(body: any) {
  return {
    json: async () => body,
  } as any;
}

beforeEach(() => {
  vi.resetAllMocks();
});

async function loadHandler() {
  const mod = await import("../route");
  return mod.PATCH;
}

describe("PATCH /api/admin/orders/[id]", () => {
  it("returns 401 when requireAdmin fails", async () => {
    requireAdminMock.mockResolvedValue({
      ok: false,
      response: new Response(JSON.stringify({ error: "Authentication required" }), { status: 401 }),
    });
    const PATCH = await loadHandler();
    const res = await PATCH(makeRequest({ status: "shipped" }), { params: { id: "order-1" } });
    expect(res.status).toBe(401);
  });

  it("PATCH with only status updates orders and does not touch items or products", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "orders" && op === "update") {
        return {
          data: { id: "order-1", status: "shipped", order_items: [] },
          error: null,
        };
      }
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(makeRequest({ status: "shipped" }), { params: { id: "order-1" } });
    expect(res.status).toBe(200);
    const tablesTouched = supabase.calls.map((c) => `${c.table}:${c.op}`);
    expect(tablesTouched).not.toContain("order_items:delete");
    expect(tablesTouched).not.toContain("order_items:insert");
    expect(tablesTouched).not.toContain("products:update");
  });

  it("PATCH with shipping maps to shipping_* columns", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    await PATCH(
      makeRequest({
        shipping: {
          first_name: "Ana",
          last_name: "Pérez",
          address_1: "Calle 1",
          city: "CABA",
          state: "BA",
          postal_code: "1000",
          phone: "555",
        },
      }),
      { params: { id: "order-1" } },
    );
    const updateCall = supabase.calls.find((c) => c.table === "orders" && c.op === "update")!;
    expect(updateCall.payload.shipping_first_name).toBe("Ana");
    expect(updateCall.payload.shipping_last_name).toBe("Pérez");
    expect(updateCall.payload.shipping_address_1).toBe("Calle 1");
    expect(updateCall.payload.shipping_city).toBe("CABA");
    expect(updateCall.payload.shipping_state).toBe("BA");
    expect(updateCall.payload.shipping_postal_code).toBe("1000");
    expect(updateCall.payload.shipping_phone).toBe("555");
  });

  it("PATCH adding a new item: deletes old items, inserts new, decrements stock", async () => {
    const supabase = makeSupabaseMock((table, op, single) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [] }; // no existing items
      }
      if (table === "products" && op === "select") {
        if (single) return { data: { inventory_quantity: 10 }, error: null };
        return {
          data: [{ id: "p-new", name: "Crema", inventory_quantity: 10 }],
        };
      }
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      if (table === "order_items" && op === "delete") return { error: null };
      if (table === "order_items" && op === "insert") return { error: null };
      if (table === "products" && op === "update") return { error: null };
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(
      makeRequest({
        items: [{ product_id: "p-new", product_name: "Crema", quantity: 3, unit_price: 100 }],
      }),
      { params: { id: "order-1" } },
    );
    expect(res.status).toBe(200);
    const ops = supabase.calls.map((c) => `${c.table}:${c.op}`);
    expect(ops).toContain("order_items:delete");
    expect(ops).toContain("order_items:insert");
    expect(ops).toContain("products:update");
    const insertCall = supabase.calls.find((c) => c.table === "order_items" && c.op === "insert")!;
    expect(insertCall.payload[0]).toMatchObject({
      order_id: "order-1",
      product_id: "p-new",
      product_name: "Crema",
      quantity: 3,
      unit_price: 100,
      total_price: 300,
    });
  });

  it("PATCH increasing quantity decrements stock by the delta", async () => {
    const supabase = makeSupabaseMock((table, op, single) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [{ id: "i1", product_id: "p1", quantity: 2 }] };
      }
      if (table === "products" && op === "select") {
        if (single) return { data: { inventory_quantity: 100 }, error: null };
        return { data: [{ id: "p1", name: "X", inventory_quantity: 100 }] };
      }
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      if (table === "products" && op === "update") return { error: null };
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    await PATCH(
      makeRequest({
        items: [{ product_id: "p1", product_name: "X", quantity: 5, unit_price: 50 }],
      }),
      { params: { id: "order-1" } },
    );
    const productUpdate = supabase.calls.find((c) => c.table === "products" && c.op === "update")!;
    // 100 - (5-2) = 97
    expect(productUpdate.payload.inventory_quantity).toBe(97);
  });

  it("PATCH decreasing quantity returns stock", async () => {
    const supabase = makeSupabaseMock((table, op, single) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [{ id: "i1", product_id: "p1", quantity: 5 }] };
      }
      if (table === "products" && op === "select") {
        if (single) return { data: { inventory_quantity: 50 }, error: null };
        return { data: [], error: null };
      }
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      if (table === "products" && op === "update") return { error: null };
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(
      makeRequest({
        items: [{ product_id: "p1", product_name: "X", quantity: 2, unit_price: 50 }],
      }),
      { params: { id: "order-1" } },
    );
    expect(res.status).toBe(200);
  });

  it("PATCH removing all items returns full stock for each item", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [{ id: "i1", product_id: "p1", quantity: 4 }] };
      }
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(makeRequest({ items: [] }), { params: { id: "order-1" } });
    expect(res.status).toBe(200);
    const ops = supabase.calls.map((c) => `${c.table}:${c.op}`);
    expect(ops).toContain("order_items:delete");
    expect(ops).not.toContain("order_items:insert");
  });

  it("PATCH returns 409 with product_name and available when stock is insufficient", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [{ id: "i1", product_id: "p1", quantity: 2 }] };
      }
      if (table === "products" && op === "select") {
        return { data: [{ id: "p1", name: "Crema Stock-Limit", inventory_quantity: 1 }] };
      }
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(
      makeRequest({
        items: [{ product_id: "p1", product_name: "Crema Stock-Limit", quantity: 5, unit_price: 50 }],
      }),
      { params: { id: "order-1" } },
    );
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toBe("Stock insuficiente");
    expect(json.product_name).toBe("Crema Stock-Limit");
    expect(json.available).toBe(1);

    const ops = supabase.calls.map((c) => `${c.table}:${c.op}`);
    expect(ops).not.toContain("order_items:delete");
    expect(ops).not.toContain("order_items:insert");
    expect(ops).not.toContain("orders:update");
  });

  it("PATCH rejects items without product_id", async () => {
    const supabase = makeSupabaseMock(() => ({ data: null, error: null }));
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(
      makeRequest({
        items: [{ product_name: "Manual", quantity: 1, unit_price: 50 }],
      }),
      { params: { id: "order-1" } },
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/product_id/);
  });

  it("PATCH with two items same product_id sums quantities for stock validation", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") return { data: [] };
      if (table === "products" && op === "select") {
        return { data: [{ id: "p1", name: "X", inventory_quantity: 4 }] };
      }
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(
      makeRequest({
        items: [
          { product_id: "p1", product_name: "X", quantity: 3, unit_price: 50, variant_title: "A" },
          { product_id: "p1", product_name: "X", quantity: 3, unit_price: 50, variant_title: "B" },
        ],
      }),
      { params: { id: "order-1" } },
    );
    // Combined need = 6, available = 4 → 409
    expect(res.status).toBe(409);
  });
});
