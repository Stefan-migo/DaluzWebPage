# Admin: Edición de pedidos desde `/admin/orders`

**Fecha:** 2026-05-07
**Scope:** B (edición media) — shipping, items, tracking, notas, total. Estado y estado de pago siguen editándose por los selectores inline existentes.

---

## 1. Objetivo

Permitir que un admin edite un pedido existente desde el panel `/admin/orders`, accediendo a la acción "Editar" dentro del menú de acciones de cada fila.

## 2. Alcance

### Editable
- Dirección de envío (7 campos: `first_name`, `last_name`, `address_1`, `city`, `state`, `postal_code`, `phone`).
- Items del pedido: agregar, eliminar, modificar cantidad y precio unitario. Búsqueda de productos contra `/api/admin/products/search`.
- `tracking_number` y `carrier`.
- Notas (`notes`).
- `total_amount` con recálculo automático desde items + override manual.

### No editable
- Cliente (email, nombre): solo lectura. Cambiar el cliente excede el alcance B.
- Estado y estado de pago: ya se editan desde los selectores inline de la tabla.
- Número de pedido, fechas de creación, IDs de MercadoPago.

## 3. Arquitectura

### Componentes nuevos
- `src/components/admin/orders/EditOrderDialog.tsx` — modal con el formulario de edición.

### Componentes modificados
- `src/components/admin/orders/OrderTable.tsx` — agregar item "Editar" en `OrderActions`, nueva prop `onEditOrder`.
- `src/app/admin/orders/page.tsx` — estado `editingOrder`, función `updateOrder()` que hace `PATCH` con el payload completo y refetchea, render del `EditOrderDialog`.
- `src/app/api/admin/orders/[id]/route.ts` — extender `PATCH` para aceptar nuevos campos y manejar items + stock.

### Componentes reutilizados (sin tocar)
- `OrderDetailDialog.tsx` queda como solo lectura.
- Patrón de búsqueda de productos de `CreateManualOrderForm.tsx`.
- `requireAdmin()` en el endpoint.

## 4. UI del `EditOrderDialog`

Modal `max-w-3xl max-h-[90vh] overflow-y-auto`. Al abrir, hace `GET /api/admin/orders/[id]` para obtener el pedido completo con `order_items`, `shipping_*` y `notes` (el objeto `Order` que recibe la tabla puede no traer todos los campos). Estructura en cards:

1. **Cliente** (solo lectura): email, nombre — disabled.
2. **Información de envío** (editable): 7 inputs.
3. **Productos**: buscador de productos + lista de items con nombre (read-only si tiene `product_id`, editable si fue manual), `variant_title` (read-only), cantidad, precio unitario, botón eliminar. Cualquier cambio dispara recálculo de total.
4. **Pago y envío operativo**: `tracking_number`, `carrier`.
5. **Notas**: textarea.

**Footer**: subtotal (read-only, calculado), total_amount (editable, autocompleta con subtotal pero el admin puede sobrescribir), botón "Recalcular", botones "Cancelar" / "Guardar cambios".

### Estados de UI
- `loading` mientras se guarda (botón disabled + spinner).
- Validación cliente: al menos 1 item; cada item con nombre, `quantity ≥ 1`, `unit_price ≥ 0`; `total_amount ≥ 0`; shipping completo si se llena alguno.
- Si la API responde 409 por stock, toast con producto y stock disponible. Form queda abierto.
- Si responde 200, toast `"Pedido actualizado"`, cerrar dialog, `fetchOrders()`.

## 5. API: extensión de `PATCH /api/admin/orders/[id]`

### Body extendido
```ts
{
  // existentes (sin cambios)
  status?: OrderStatus,
  payment_status?: PaymentStatus,
  tracking_number?: string,
  carrier?: string,

  // nuevos
  shipping?: {
    first_name: string,
    last_name: string,
    address_1: string,
    address_2?: string,
    city: string,
    state: string,
    postal_code: string,
    phone: string,
  },
  items?: Array<{
    product_id?: string,        // null = item manual
    product_name: string,
    variant_title?: string,
    quantity: number,
    unit_price: number,
  }>,
  notes?: string,
  subtotal?: number,
  total_amount?: number,
}
```

### Mapeo a columnas de `orders`
- `shipping.first_name` → `shipping_first_name`, etc.
- `notes`, `subtotal`, `total_amount` → columnas directas.

### Flujo del handler

1. **Auth** — `requireAdmin()` (sin cambios).
2. **Leer estado actual**: `orders.status`, `shipped_at`, `delivered_at`, y `order_items` (id, product_id, quantity).
3. **Calcular delta de stock** (solo si vino `items`):
   - `oldQty[product_id]` desde items actuales (sumando duplicados).
   - `newQty[product_id]` desde items del body (sumando duplicados).
   - `delta = newQty - oldQty` por producto. Items sin `product_id` (manuales) se ignoran.
4. **Validar stock** (regla A): para cada producto con `delta > 0`, leer `inventory_quantity`. Si `inventory_quantity < delta`, devolver `409` con `{ error: "Stock insuficiente", product_id, product_name, available }`. NO ejecuta UPDATE/DELETE/INSERT.
5. **Aplicar cambios**:
   - **a)** UPDATE `orders` con todos los campos simples que vinieron en el body (shipping_*, notes, subtotal, total_amount, tracking_number, carrier, status, payment_status, updated_at; `shipped_at`/`delivered_at` si corresponde por status — lógica existente).
   - **b)** Si vino `items`: DELETE `order_items WHERE order_id = id`; INSERT nuevos items con `total_price = quantity * unit_price`.
   - **c)** Aplicar deltas: por cada producto, UPDATE `products SET inventory_quantity = inventory_quantity - delta`. Delta negativo devuelve unidades.
6. **Email de cambio de status**: mantener lógica existente solo si vino `status` y cambió. Edición de items/shipping NO envía email (regla 5.2).
7. **Devolver el pedido actualizado** con sus items.

### Edge cases cubiertos
- Pedido sin items previos: delta = newQty.
- Item manual sin `product_id`: no toca stock.
- Mismo `product_id` con dos `variant_title` en el array: se suman para stock.
- Si UPDATE de `orders` falla → 500 sin tocar items ni stock.
- Si INSERT de items falla luego del DELETE → log crítico, 500. Mitigado validando stock y shape antes.

### Regresión
- Llamadas existentes `PATCH` con solo `status` o `payment_status` (selectores inline) siguen funcionando idénticamente: si no viene `items` ni `shipping`, no se ejecuta lógica de stock ni de items.

## 6. Reglas de negocio acordadas

- **Stock**: ajuste automático en cada edición de items. Stock insuficiente → 409, edición rechazada (regla A).
- **Notificación al cliente**: NO automática al editar items/shipping. El admin usa "Notificación" del menú si quiere avisar.

## 7. Errores y respuestas del cliente

| Status | Acción cliente |
|--------|----------------|
| 200    | Toast "Pedido actualizado", cerrar dialog, `fetchOrders()` |
| 400    | Toast con mensaje del server, form abierto |
| 409    | Toast "Stock insuficiente para [producto]. Disponible: [n]", form abierto |
| 500    | Toast "Error al guardar el pedido", form abierto |

## 8. Tests

**Ubicación**: `src/app/api/admin/orders/[id]/__tests__/route.test.ts` (Vitest, environment node, mocks de `requireAdmin` y cliente Supabase).

### Casos cubiertos
1. PATCH solo con `status` → UPDATE de campos simples; NO toca `order_items` ni `products`. (regresión)
2. PATCH con `shipping` → mapea a columnas `shipping_*`.
3. PATCH con items: agregar item nuevo → DELETE old + INSERT new + descuento de stock por delta.
4. PATCH con items: aumentar cantidad → descuento de stock = nuevo - viejo.
5. PATCH con items: disminuir cantidad → devuelve stock.
6. PATCH con items: eliminar item → devuelve stock completo.
7. PATCH con items: stock insuficiente → 409 con `product_name` y `available`; NO ejecuta DELETE/INSERT/UPDATE.
8. PATCH con item manual (sin `product_id`) → no afecta stock.
9. PATCH con dos items mismo `product_id` → suma cantidades para validación de stock.
10. PATCH sin auth → 401 (delegado a `requireAdmin`).

## 9. Seguridad

- Edición protegida por `requireAdmin()` en el endpoint. El botón "Editar" en `/admin/orders` ya está detrás del guard de admin del dashboard.
- No hay nuevas superficies de auth; solo se extiende un endpoint que ya valida.

## 10. Fuera de alcance

- Cambiar el cliente del pedido.
- Editar `order_number`, fechas de creación, IDs de MercadoPago.
- Auditoría/historial de cambios.
- Re-cálculo de impuestos / descuentos automáticos (no existen hoy en el modelo).
- Email automático al cliente sobre cambios.
