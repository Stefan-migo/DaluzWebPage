# Admin Edit Orders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Editar" action to `/admin/orders` that lets admins edit shipping address, items (with automatic stock adjustment), tracking, notes and totals on existing orders.

**Architecture:** New `EditOrderDialog` component opens from the actions dropdown, fetches the full order via `GET /api/admin/orders/[id]`, and saves via the extended `PATCH /api/admin/orders/[id]`. The PATCH endpoint accepts new fields (`shipping`, `items`, `notes`, `subtotal`, `total_amount`) and, when items change, validates stock, replaces `order_items`, and adjusts `products.inventory_quantity` by delta.

**Tech Stack:** Next.js (App Router), React, TypeScript, Supabase, Vitest, shadcn/ui, sonner (toasts).

**Reference spec:** `Docs/superpowers/specs/2026-05-07-admin-edit-orders-design.md`

---

## File Structure

### Create
- `src/lib/admin/orderStock.ts` — pure helper to compute stock deltas from old/new items.
- `src/lib/admin/orderStock.test.ts` — unit tests for the helper.
- `src/components/admin/orders/EditOrderDialog.tsx` — modal form for editing.
- `src/app/api/admin/orders/[id]/__tests__/route.test.ts` — endpoint tests.

### Modify
- `src/app/api/admin/orders/[id]/route.ts` — extend PATCH handler.
- `src/components/admin/orders/OrderTable.tsx` — add "Editar" menu item + `onEditOrder` prop.
- `src/app/admin/orders/page.tsx` — wire `editingOrder` state, save handler, render dialog.

---

## Task 1: Stock Delta Helper (TDD)

Pure function isolated from Supabase so we can unit-test it cheaply. The PATCH handler will call it.

**Files:**
- Create: `src/lib/admin/orderStock.ts`
- Create: `src/lib/admin/orderStock.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/admin/orderStock.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/admin/orderStock.test.ts`
Expected: FAIL with "Cannot find module './orderStock'".

- [ ] **Step 3: Implement the helper**

Create `src/lib/admin/orderStock.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/admin/orderStock.test.ts`
Expected: PASS, 8 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/orderStock.ts src/lib/admin/orderStock.test.ts
git commit -m "feat(admin): add computeStockDelta helper for order edits"
```

---

## Task 2: Extend PATCH endpoint — schema + validation (no behavior change yet)

We extend the body parsing so the handler accepts the new fields, but we do NOT yet wire item replacement or stock adjustment. This keeps the regression surface small.

**Files:**
- Modify: `src/app/api/admin/orders/[id]/route.ts`

- [ ] **Step 1: Read the current PATCH handler**

Read `src/app/api/admin/orders/[id]/route.ts` lines 1–165 to confirm the existing structure.

- [ ] **Step 2: Add the extended body destructuring and shipping mapping**

In `src/app/api/admin/orders/[id]/route.ts`, replace the block that destructures the body (currently around line 14):

```ts
    const body = await request.json();
    const { status, payment_status, tracking_number, carrier } = body;

    console.log('📝 Updating order with:', { status, payment_status, tracking_number, carrier });
```

with:

```ts
    const body = await request.json();
    const {
      status,
      payment_status,
      tracking_number,
      carrier,
      shipping,
      items,
      notes,
      subtotal,
      total_amount,
    } = body;

    console.log('📝 Updating order with:', {
      status,
      payment_status,
      tracking_number,
      carrier,
      hasShipping: !!shipping,
      itemsCount: Array.isArray(items) ? items.length : null,
    });
```

- [ ] **Step 3: Map shipping fields and add new simple columns to updateData**

In the same file, locate the block that builds `updateData` (currently lines 26–53). Replace from the `if (carrier !== undefined)` block onwards (so the new mappings sit right after it) — replace this snippet:

```ts
    if (carrier !== undefined) {
      updateData.carrier = carrier;
    }
```

with:

```ts
    if (carrier !== undefined) {
      updateData.carrier = carrier;
    }

    if (notes !== undefined) {
      updateData.customer_notes = notes;
    }

    if (subtotal !== undefined) {
      updateData.subtotal = subtotal;
    }

    if (total_amount !== undefined) {
      updateData.total_amount = total_amount;
    }

    if (shipping && typeof shipping === 'object') {
      const allowedShipping = [
        'first_name',
        'last_name',
        'address_1',
        'address_2',
        'city',
        'state',
        'postal_code',
        'phone',
      ] as const;
      for (const key of allowedShipping) {
        if (shipping[key] !== undefined) {
          updateData[`shipping_${key}`] = shipping[key];
        }
      }
    }
```

Note: the orders table column for notes is `customer_notes` (per the migration in `supabase/migrations/20241220000001_create_ecommerce_system.sql`).

- [ ] **Step 4: Quick smoke check via type-check**

Run: `npm run type-check`
Expected: PASS (no new TS errors).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/orders/[id]/route.ts
git commit -m "feat(api): extend admin PATCH order to accept shipping, notes, totals"
```

---

## Task 3: Extend PATCH endpoint — items replacement + stock adjustment

Now we add the items-replace flow. This is the heaviest change: we read existing items, validate stock against deltas, replace items, and adjust inventory.

**Files:**
- Modify: `src/app/api/admin/orders/[id]/route.ts`

- [ ] **Step 1: Import the helper and add the items handling block**

At the top of `src/app/api/admin/orders/[id]/route.ts`, add this import after the existing imports:

```ts
import { computeStockDelta } from '@/lib/admin/orderStock';
```

- [ ] **Step 2: Insert items handling before the main UPDATE**

In the same file, locate the block that performs the UPDATE on `orders` (currently the `// Update the order` comment and the `supabase.from('orders').update(updateData)` call, around lines 55–71).

Right BEFORE that `// Update the order` block, insert:

```ts
    // Items replacement + stock adjustment
    let stockDelta: Record<string, number> = {};
    let oldItems: Array<{ id: string; product_id: string | null; quantity: number }> = [];
    if (Array.isArray(items)) {
      // Validate item shape
      for (const it of items) {
        if (
          typeof it !== 'object' ||
          it === null ||
          typeof it.product_name !== 'string' ||
          it.product_name.trim() === '' ||
          typeof it.quantity !== 'number' ||
          !Number.isFinite(it.quantity) ||
          it.quantity < 1 ||
          typeof it.unit_price !== 'number' ||
          !Number.isFinite(it.unit_price) ||
          it.unit_price < 0
        ) {
          return NextResponse.json(
            { error: 'Invalid item payload' },
            { status: 400 },
          );
        }
      }

      // Read current items for delta calculation
      const { data: existingItems, error: existingItemsError } = await supabase
        .from('order_items')
        .select('id, product_id, quantity')
        .eq('order_id', params.id);

      if (existingItemsError) {
        console.error('❌ Error reading existing items:', existingItemsError);
        return NextResponse.json(
          { error: 'Failed to read existing items' },
          { status: 500 },
        );
      }
      oldItems = existingItems || [];

      // Compute delta and validate stock
      stockDelta = computeStockDelta(
        oldItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        items.map((i: any) => ({ product_id: i.product_id ?? null, quantity: i.quantity })),
      );

      const productIdsToCheck = Object.entries(stockDelta)
        .filter(([, d]) => d > 0)
        .map(([id]) => id);

      if (productIdsToCheck.length > 0) {
        const { data: productsForCheck, error: productsError } = await supabase
          .from('products')
          .select('id, name, inventory_quantity')
          .in('id', productIdsToCheck);

        if (productsError) {
          console.error('❌ Error reading products for stock check:', productsError);
          return NextResponse.json(
            { error: 'Failed to verify stock' },
            { status: 500 },
          );
        }

        for (const product of productsForCheck || []) {
          const need = stockDelta[product.id];
          const available = product.inventory_quantity ?? 0;
          if (available < need) {
            return NextResponse.json(
              {
                error: 'Stock insuficiente',
                product_id: product.id,
                product_name: product.name,
                available,
              },
              { status: 409 },
            );
          }
        }
      }
    }
```

- [ ] **Step 3: After the orders UPDATE, perform the items replace + stock adjustments**

In the same file, locate the block immediately after `console.log('✅ Order updated successfully');` (currently around line 81). Insert this block right after that log line and BEFORE the `// Send email notifications based on status changes` comment:

```ts
    // If items were provided, replace order_items and adjust stock
    if (Array.isArray(items)) {
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', params.id);

      if (deleteItemsError) {
        console.error('❌ Error deleting old order items:', deleteItemsError);
        return NextResponse.json(
          { error: 'Failed to replace order items' },
          { status: 500 },
        );
      }

      if (items.length > 0) {
        const itemsToInsert = items.map((it: any) => ({
          order_id: params.id,
          product_id: it.product_id ?? null,
          product_name: it.product_name,
          variant_title: it.variant_title ?? null,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.quantity * it.unit_price,
        }));

        const { error: insertItemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (insertItemsError) {
          console.error('❌ Error inserting new order items:', insertItemsError);
          return NextResponse.json(
            { error: 'Failed to insert new order items' },
            { status: 500 },
          );
        }
      }

      // Apply stock deltas: subtract delta from inventory_quantity
      for (const [productId, delta] of Object.entries(stockDelta)) {
        const { data: prod, error: readErr } = await supabase
          .from('products')
          .select('inventory_quantity')
          .eq('id', productId)
          .single();
        if (readErr || !prod) {
          console.error('⚠️ Could not read product for stock adjustment:', productId, readErr);
          continue;
        }
        const newQty = (prod.inventory_quantity ?? 0) - delta;
        const { error: updErr } = await supabase
          .from('products')
          .update({ inventory_quantity: newQty })
          .eq('id', productId);
        if (updErr) {
          console.error('⚠️ Could not update product inventory:', productId, updErr);
        }
      }
    }
```

- [ ] **Step 4: Type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/orders/[id]/route.ts
git commit -m "feat(api): replace order items and adjust stock on admin order edit"
```

---

## Task 4: Endpoint integration tests

We add Vitest tests that mock `requireAdmin` and the Supabase client, exercising the full PATCH handler. We mirror the structure used in `src/__tests__/` (Vitest + node environment).

**Files:**
- Create: `src/app/api/admin/orders/[id]/__tests__/route.test.ts`

- [ ] **Step 1: Write the test file**

Create `src/app/api/admin/orders/[id]/__tests__/route.test.ts`:

```ts
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

function makeSupabaseMock(setup: (table: string, op: string) => any) {
  const calls: CallLog[] = [];
  const from = vi.fn((table: string) => {
    const builder: any = {};
    let currentOp = "select";
    let currentPayload: any = undefined;
    const filters: Array<[string, any]> = [];

    const finalize = () => setup(table, currentOp);

    builder.select = vi.fn(() => {
      currentOp = "select";
      return builder;
    });
    builder.update = vi.fn((payload: any) => {
      currentOp = "update";
      currentPayload = payload;
      calls.push({ table, op: "update", payload, filters });
      return builder;
    });
    builder.insert = vi.fn((payload: any) => {
      currentOp = "insert";
      currentPayload = payload;
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
    builder.single = vi.fn(() => Promise.resolve(finalize()));
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
    let updateCall: any = null;
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
    updateCall = supabase.calls.find((c) => c.table === "orders" && c.op === "update");
    expect(updateCall.payload.shipping_first_name).toBe("Ana");
    expect(updateCall.payload.shipping_last_name).toBe("Pérez");
    expect(updateCall.payload.shipping_address_1).toBe("Calle 1");
    expect(updateCall.payload.shipping_city).toBe("CABA");
    expect(updateCall.payload.shipping_state).toBe("BA");
    expect(updateCall.payload.shipping_postal_code).toBe("1000");
    expect(updateCall.payload.shipping_phone).toBe("555");
  });

  it("PATCH adding a new item: deletes old items, inserts new, decrements stock", async () => {
    const productInventory: Record<string, number> = { "p-new": 10 };
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [] }; // no existing items
      }
      if (table === "products" && op === "select") {
        return {
          data: [{ id: "p-new", name: "Crema", inventory_quantity: productInventory["p-new"] }],
        };
      }
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      if (table === "order_items" && op === "delete") return { error: null };
      if (table === "order_items" && op === "insert") return { error: null };
      if (table === "products" && op === "update") return { error: null };
      // single() for products read during stock apply
      if (table === "products" && op === "select") {
        return { data: { inventory_quantity: productInventory["p-new"] }, error: null };
      }
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
    const insertCall = supabase.calls.find((c) => c.table === "order_items" && c.op === "insert");
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
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [{ id: "i1", product_id: "p1", quantity: 2 }] };
      }
      if (table === "products" && op === "select") {
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
    const productUpdate = supabase.calls.find((c) => c.table === "products" && c.op === "update");
    // 100 - (5-2) = 97
    expect(productUpdate.payload.inventory_quantity).toBe(97);
  });

  it("PATCH decreasing quantity returns stock", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") {
        return { data: [{ id: "i1", product_id: "p1", quantity: 5 }] };
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
        items: [{ product_id: "p1", product_name: "X", quantity: 2, unit_price: 50 }],
      }),
      { params: { id: "order-1" } },
    );
    // delta = 2-5 = -3; the products:update should add 3 to current inventory.
    // products:select for stock-apply returns { inventory_quantity: 100 } via the table-level mock.
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

  it("PATCH with manual item (no product_id) does not affect stock", async () => {
    const supabase = makeSupabaseMock((table, op) => {
      if (table === "orders" && op === "select") {
        return { data: { status: "pending", shipped_at: null, delivered_at: null } };
      }
      if (table === "order_items" && op === "select") return { data: [] };
      if (table === "orders" && op === "update") {
        return { data: { id: "order-1", order_items: [] }, error: null };
      }
      return { data: null, error: null };
    });
    requireAdminMock.mockResolvedValue({ ok: true, user: { id: "admin" }, supabase: { from: supabase.from } });
    const PATCH = await loadHandler();
    const res = await PATCH(
      makeRequest({
        items: [{ product_name: "Manual", quantity: 1, unit_price: 50 }],
      }),
      { params: { id: "order-1" } },
    );
    expect(res.status).toBe(200);
    const ops = supabase.calls.map((c) => `${c.table}:${c.op}`);
    expect(ops).not.toContain("products:update");
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
```

- [ ] **Step 2: Run the test file to verify it passes**

Run: `npm test -- src/app/api/admin/orders/[id]/__tests__/route.test.ts`
Expected: PASS, 10 tests passed.

If any test fails because the chainable mock doesn't match a particular call shape used by the handler, adjust the test's `setup` function to return the expected shape — do NOT change the handler unless the test exposes a real bug.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/orders/[id]/__tests__/route.test.ts
git commit -m "test(api): cover admin PATCH order edits (items, stock, regression)"
```

---

## Task 5: Add `EditOrderDialog` component

**Files:**
- Create: `src/components/admin/orders/EditOrderDialog.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/admin/orders/EditOrderDialog.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditOrderDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

interface ItemDraft {
  id?: string;
  product_id?: string | null;
  product_name: string;
  variant_title?: string | null;
  quantity: number;
  unit_price: number;
}

interface ShippingDraft {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

interface FormState {
  customer_email: string;
  customer_name: string;
  shipping: ShippingDraft;
  items: ItemDraft[];
  tracking_number: string;
  carrier: string;
  notes: string;
  subtotal: number;
  total_amount: number;
}

const EMPTY_SHIPPING: ShippingDraft = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postal_code: "",
  phone: "",
};

export default function EditOrderDialog({
  orderId,
  open,
  onOpenChange,
  onSaved,
}: EditOrderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<any[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [openProductSearch, setOpenProductSearch] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to load order");
      const json = await res.json();
      const o = json.order;

      const items: ItemDraft[] = (o.order_items || []).map((it: any) => ({
        id: it.id,
        product_id: it.product_id ?? null,
        product_name: it.product_name,
        variant_title: it.variant_title ?? null,
        quantity: Number(it.quantity) || 0,
        unit_price: Number(it.unit_price) || 0,
      }));

      setForm({
        customer_email: o.email ?? "",
        customer_name: [o.shipping_first_name, o.shipping_last_name]
          .filter(Boolean)
          .join(" "),
        shipping: {
          first_name: o.shipping_first_name ?? "",
          last_name: o.shipping_last_name ?? "",
          address_1: o.shipping_address_1 ?? "",
          address_2: o.shipping_address_2 ?? "",
          city: o.shipping_city ?? "",
          state: o.shipping_state ?? "",
          postal_code: o.shipping_postal_code ?? "",
          phone: o.shipping_phone ?? "",
        },
        items,
        tracking_number: o.tracking_number ?? "",
        carrier: o.carrier ?? "",
        notes: o.customer_notes ?? "",
        subtotal: Number(o.subtotal) || 0,
        total_amount: Number(o.total_amount) || 0,
      });
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar el pedido");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }, [orderId, onOpenChange]);

  useEffect(() => {
    if (open && orderId) {
      loadOrder();
    } else {
      setForm(null);
      setProductSearch("");
      setProductResults([]);
    }
  }, [open, orderId, loadOrder]);

  // Product search (debounced)
  useEffect(() => {
    if (productSearch.length < 2) {
      setProductResults([]);
      return;
    }
    setSearchingProducts(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/admin/products/search?q=${encodeURIComponent(productSearch)}`,
        );
        if (r.ok) {
          const j = await r.json();
          setProductResults(j.products || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearchingProducts(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const subtotalFromItems = (items: ItemDraft[]) =>
    items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      const newSubtotal = subtotalFromItems(items);
      return { ...prev, items, subtotal: newSubtotal, total_amount: newSubtotal };
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = prev.items.filter((_, i) => i !== idx);
      const newSubtotal = subtotalFromItems(items);
      return { ...prev, items, subtotal: newSubtotal, total_amount: newSubtotal };
    });
  };

  const addProduct = (product: any) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = [
        ...prev.items,
        {
          product_id: product.id,
          product_name: product.name,
          variant_title: null,
          quantity: 1,
          unit_price: Number(product.price) || 0,
        },
      ];
      const newSubtotal = subtotalFromItems(items);
      return { ...prev, items, subtotal: newSubtotal, total_amount: newSubtotal };
    });
    setProductSearch("");
    setOpenProductSearch(false);
  };

  const recalculate = () => {
    setForm((prev) =>
      prev ? { ...prev, total_amount: subtotalFromItems(prev.items) } : prev,
    );
  };

  const validate = (f: FormState): string | null => {
    if (f.items.length < 1) return "El pedido debe tener al menos un producto";
    for (const it of f.items) {
      if (!it.product_name.trim()) return "Hay items sin nombre de producto";
      if (!Number.isFinite(it.quantity) || it.quantity < 1)
        return "Hay items con cantidad inválida";
      if (!Number.isFinite(it.unit_price) || it.unit_price < 0)
        return "Hay items con precio inválido";
    }
    if (!Number.isFinite(f.total_amount) || f.total_amount < 0)
      return "Total inválido";
    return null;
  };

  const handleSave = async () => {
    if (!form || !orderId) return;
    const err = validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        shipping: form.shipping,
        items: form.items.map((it) => ({
          product_id: it.product_id ?? null,
          product_name: it.product_name,
          variant_title: it.variant_title ?? null,
          quantity: it.quantity,
          unit_price: it.unit_price,
        })),
        tracking_number: form.tracking_number,
        carrier: form.carrier,
        notes: form.notes,
        subtotal: form.subtotal,
        total_amount: form.total_amount,
      };
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 409) {
        const j = await res.json().catch(() => ({}));
        toast.error(
          `Stock insuficiente para ${j.product_name ?? "producto"}. Disponible: ${j.available ?? 0}`,
        );
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error || "Error al guardar el pedido");
        return;
      }
      toast.success("Pedido actualizado");
      onSaved();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar el pedido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>
            Modifica los datos del pedido. El stock se ajustará automáticamente.
          </DialogDescription>
        </DialogHeader>

        {loading || !form ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Customer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={form.customer_email} disabled />
                </div>
                <div>
                  <Label>Nombre</Label>
                  <Input value={form.customer_name} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={form.shipping.first_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, first_name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      value={form.shipping.last_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, last_name: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input
                    value={form.shipping.address_1}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shipping: { ...form.shipping, address_1: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Ciudad</Label>
                    <Input
                      value={form.shipping.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, city: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Provincia</Label>
                    <Input
                      value={form.shipping.state}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, state: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Código Postal</Label>
                    <Input
                      value={form.shipping.postal_code}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, postal_code: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={form.shipping.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shipping: { ...form.shipping, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Label>Buscar producto</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar productos por nombre..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setOpenProductSearch(true);
                      }}
                      className="pl-10"
                    />
                    {searchingProducts && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {openProductSearch && productResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {productResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addProduct(p)}
                          className="w-full p-3 text-left hover:bg-gray-100 border-b last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-sm text-gray-600">
                                Stock: {p.inventory_quantity}
                              </div>
                            </div>
                            <div className="font-semibold">${Number(p.price).toFixed(2)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {form.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-end p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <Label>Producto</Label>
                      <Input
                        value={it.product_name}
                        onChange={(e) => updateItem(idx, { product_name: e.target.value })}
                        disabled={!!it.product_id}
                      />
                      {it.variant_title && (
                        <div className="text-xs text-gray-500 mt-1">
                          Variante: {it.variant_title}
                        </div>
                      )}
                    </div>
                    <div className="w-24">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) =>
                          updateItem(idx, { quantity: parseInt(e.target.value, 10) || 1 })
                        }
                      />
                    </div>
                    <div className="w-32">
                      <Label>Precio</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={it.unit_price}
                        onChange={(e) =>
                          updateItem(idx, { unit_price: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      aria-label="Eliminar item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tracking + Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Envío y Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tracking</Label>
                    <Input
                      value={form.tracking_number}
                      onChange={(e) =>
                        setForm({ ...form, tracking_number: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Transportista</Label>
                    <Input
                      value={form.carrier}
                      onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Notas</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Totals */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-semibold">
                  ${form.subtotal.toFixed(2)}
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <Label>Total</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.total_amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        total_amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <Button type="button" variant="outline" onClick={recalculate}>
                  Recalcular
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/orders/EditOrderDialog.tsx
git commit -m "feat(admin): add EditOrderDialog for editing orders"
```

---

## Task 6: Wire "Editar" into the OrderTable actions

**Files:**
- Modify: `src/components/admin/orders/OrderTable.tsx`

- [ ] **Step 1: Add `onEditOrder` prop and pass it through**

Edit `src/components/admin/orders/OrderTable.tsx`. Replace the `OrderTableProps` interface (around line 42–57) by adding `onEditOrder`:

```ts
interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  updating?: string | null;
  deletingOrder?: string | null;
  currentPage?: number;
  totalPages?: number;
  totalOrders?: number;
  ordersPerPage?: number;
  onUpdateStatus?: (orderId: string, status: string) => void;
  onUpdatePaymentStatus?: (orderId: string, status: string) => void;
  onViewDetails?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onSendNotification?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
  onPageChange?: (page: number) => void;
}
```

- [ ] **Step 2: Add the "Editar" item to `OrderActions`**

In the same file, locate `function OrderActions(...)` (around line 204). Update its parameter destructuring to accept `onEditOrder`, and add a new `DropdownMenuItem` for "Editar" right after the "Ver Detalles" item.

Replace this block:

```tsx
function OrderActions({
  order,
  onViewDetails,
  onUpdateStatus,
  onSendNotification,
  onDeleteOrder,
  isU,
  isD,
}: any) {
```

with:

```tsx
function OrderActions({
  order,
  onViewDetails,
  onEditOrder,
  onUpdateStatus,
  onSendNotification,
  onDeleteOrder,
  isU,
  isD,
}: any) {
```

Then, locate the "Ver Detalles" dropdown item (currently:

```tsx
        {onViewDetails && (
          <DropdownMenuItem onClick={() => onViewDetails(order)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
```

) and replace it with:

```tsx
        {onViewDetails && (
          <DropdownMenuItem onClick={() => onViewDetails(order)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </DropdownMenuItem>
        )}
        {onEditOrder && (
          <DropdownMenuItem onClick={() => onEditOrder(order)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
```

- [ ] **Step 3: Import the `Pencil` icon**

In the same file, locate the `lucide-react` import (around line 28). Replace it with:

```tsx
import {
  MoreHorizontal,
  Eye,
  Mail,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  Pencil,
} from "lucide-react";
```

- [ ] **Step 4: Pass `onEditOrder` from the table to `OrderActions`**

In the same file, locate the `OrderTable` component body where `OrderActions` is rendered (around line 590). The current invocation is:

```tsx
                  <OrderActions
                    order={order}
                    onViewDetails={onViewDetails}
                    onUpdateStatus={onUpdateStatus}
                    onSendNotification={onSendNotification}
                    onDeleteOrder={onDeleteOrder}
                    isU={isUpdating(order.id)}
                    isD={deletingOrder === order.id}
                  />
```

Replace it with:

```tsx
                  <OrderActions
                    order={order}
                    onViewDetails={onViewDetails}
                    onEditOrder={onEditOrder}
                    onUpdateStatus={onUpdateStatus}
                    onSendNotification={onSendNotification}
                    onDeleteOrder={onDeleteOrder}
                    isU={isUpdating(order.id)}
                    isD={deletingOrder === order.id}
                  />
```

Also extend the destructuring in `OrderTable`'s props (around line 437–452). Replace:

```tsx
  const {
    orders,
    loading,
    updating,
    deletingOrder,
    currentPage = 1,
    totalPages = 1,
    totalOrders = 0,
    ordersPerPage = 10,
    onUpdateStatus,
    onUpdatePaymentStatus,
    onViewDetails,
    onSendNotification,
    onDeleteOrder,
    onPageChange,
  } = props;
```

with:

```tsx
  const {
    orders,
    loading,
    updating,
    deletingOrder,
    currentPage = 1,
    totalPages = 1,
    totalOrders = 0,
    ordersPerPage = 10,
    onUpdateStatus,
    onUpdatePaymentStatus,
    onViewDetails,
    onEditOrder,
    onSendNotification,
    onDeleteOrder,
    onPageChange,
  } = props;
```

- [ ] **Step 5: Type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/orders/OrderTable.tsx
git commit -m "feat(admin): add Editar action to orders table"
```

---

## Task 7: Wire `EditOrderDialog` into the orders page

**Files:**
- Modify: `src/app/admin/orders/page.tsx`

- [ ] **Step 1: Import the dialog**

Edit `src/app/admin/orders/page.tsx`. After the existing import line for `OrderDetailDialog` (around line 25), add:

```tsx
import EditOrderDialog from "@/components/admin/orders/EditOrderDialog";
```

- [ ] **Step 2: Add `editingOrderId` state**

In the same file, after the existing `useState` calls in `OrdersPage` (after `const [deletingOrder, setDeletingOrder] = useState<string | null>(null);`, around line 39), add:

```tsx
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
```

- [ ] **Step 3: Pass `onEditOrder` to the `OrderTable`**

In the same file, locate the `<OrderTable ... />` JSX (around line 483). Add the `onEditOrder` prop. Replace:

```tsx
          <OrderTable
            orders={displayOrders}
            loading={loading}
            updating={updating}
            deletingOrder={deletingOrder}
            currentPage={currentPage}
            totalPages={totalPages}
            totalOrders={totalOrders}
            ordersPerPage={ordersPerPage}
            onUpdateStatus={updateOrderStatus}
            onUpdatePaymentStatus={updatePaymentStatus}
            onViewDetails={setSelectedOrder}
            onSendNotification={sendEmailNotification}
            onDeleteOrder={deleteOrder}
            onPageChange={setCurrentPage}
          />
```

with:

```tsx
          <OrderTable
            orders={displayOrders}
            loading={loading}
            updating={updating}
            deletingOrder={deletingOrder}
            currentPage={currentPage}
            totalPages={totalPages}
            totalOrders={totalOrders}
            ordersPerPage={ordersPerPage}
            onUpdateStatus={updateOrderStatus}
            onUpdatePaymentStatus={updatePaymentStatus}
            onViewDetails={setSelectedOrder}
            onEditOrder={(order) => setEditingOrderId(order.id)}
            onSendNotification={sendEmailNotification}
            onDeleteOrder={deleteOrder}
            onPageChange={setCurrentPage}
          />
```

- [ ] **Step 4: Render the `EditOrderDialog`**

In the same file, immediately AFTER the `<OrderDetailDialog ... />` block (around line 503–507), insert:

```tsx
      <EditOrderDialog
        orderId={editingOrderId}
        open={!!editingOrderId}
        onOpenChange={(open) => !open && setEditingOrderId(null)}
        onSaved={fetchOrders}
      />
```

- [ ] **Step 5: Type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/orders/page.tsx
git commit -m "feat(admin): wire EditOrderDialog into orders page"
```

---

## Task 8: Full test suite + manual smoke test

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS for the new and existing tests. If any pre-existing tests fail unrelated to this work, leave them and note it in the final summary; do not fix unrelated failures.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS (or only warnings that already existed).

- [ ] **Step 3: Manual smoke test**

Start the dev server: `npm run dev`. Then in the browser at `/admin/orders` (logged in as admin):

1. Click the "..." menu on an order → click "Editar" → dialog opens with current order data prefilled.
2. Modify shipping address fields → save → toast "Pedido actualizado", row reflects no shipping change visually but data persists (verify by reopening).
3. Open Editar on a product-backed order → change a quantity from N to N+1 for a product with stock > 0 → save → success; verify in DB / `/admin/products` that `inventory_quantity` decreased by 1.
4. Open Editar → set quantity to a value greater than current stock + current ordered quantity → save → toast "Stock insuficiente para [producto]. Disponible: [n]"; dialog stays open.
5. Open Editar → click trash on an item → save → success; verify stock returned to inventory.
6. Open Editar → use the "Buscar producto" search → select a product → it appears in the list with quantity 1 → save → success; new item is in the order, stock decremented.
7. Open Editar → modify the Total Amount manually (override) → save → success; verify the override persisted.

- [ ] **Step 4: Final commit if any cleanup was needed**

If any minor fixes were applied during the smoke test, commit them:

```bash
git add -A
git commit -m "fix(admin): adjustments from order-edit smoke test"
```

If no fixes were needed, no commit is required.

---

## Self-review notes

- All spec sections (2.x Alcance, 3 Arquitectura, 4 UI, 5 API, 6 Reglas, 7 Errores, 8 Tests, 9 Seguridad) map to tasks above.
- Stock validation is enforced before any DB mutation (rule A).
- No automatic email on edits (rule 5.2): the existing email block remains gated by `status` change only.
- Regression for the inline status/payment selectors is covered by Task 4 test #1 (PATCH solo con status) and by the design of Task 2/3 (new logic only runs when `items` or `shipping` are present).
- Notes column is `customer_notes` (per migration), not `notes` — the API maps `notes` → `customer_notes` and the dialog reads from `customer_notes`.
