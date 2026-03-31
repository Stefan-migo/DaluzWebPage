---
name: daluz-checkout-pagos
description: Guía para desarrollar el módulo Checkout & Pagos de DA LUZ: checkout, MercadoPago, webhooks, órdenes. Usar al modificar checkout page, API checkout, webhook MercadoPago, APIs de orders, lib/mercadopago, o flujo de pago.
---

# Checkout & Pagos - Guía de Desarrollo

## Alcance

Checkout, MercadoPago, webhooks, órdenes. **No incluye catálogo ni carrito** (módulo 01).

---

## Reglas de Código

### Convenciones

- **external_reference**: Siempre `order.id` (UUID) al crear preferencia MP.
- **order_items**: Incluir `product_id`, `variant_id` (o null), `quantity`, `unit_price`, `total_price`, `product_name`, `variant_title`, `sku`.
- **Moneda**: ARS en preferencia, órdenes y formatos.
- **back_urls**: success y failure a `/checkout/success` y `/checkout/failure`.
- **notification_url**: `/api/webhooks/mercadopago`.

### Patrones a seguir

1. **Crear preferencia**:
   ```ts
   preference.create({
     body: {
       items: [...],
       payer: { name, surname, email },
       back_urls: { success, failure },
       auto_return: 'approved',
       external_reference: order.id,
       notification_url: '.../api/webhooks/mercadopago',
     }
   });
   ```

2. **Webhook idempotencia**: Antes de actualizar inventario, verificar que la orden no esté ya en estado final (completed). Evitar decrementar stock dos veces.

3. **Config MP**: Usar `getMercadoPagoConfig()` y `getMercadoPagoAccessToken()`; no acceder a `process.env` directamente para tokens si hay config en DB.

### Anti-patrones a evitar

- No fallar el webhook por errores de inventario o email; log y continuar.
- No omitir la verificación de firma en producción.
- No usar `supabase.raw` (no existe); para fallback inventario usar fetch + update.
- No crear preferencia sin `external_reference`.
- No exponer `MERCADOPAGO_ACCESS_TOKEN` ni `MERCADOPAGO_WEBHOOK_SECRET` en cliente.

---

## Seguridad

### Verificación de firma webhook (obligatoria en producción)

```ts
if (process.env.NODE_ENV === 'production') {
  const isValidSignature = await verifySignature(req, rawBody);
  if (!isValidSignature) {
    // Log y 401
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
}
```

- Header `x-signature`: formato `ts=123,hash=abc`
- Header `x-request-id`: id del evento
- Fórmula: `id:${x-request-id};ts:${ts};` → HMAC-SHA256 con webhook secret

### Validación de inputs en checkout

- `items`: array no vacío
- `customerInfo`: firstName, lastName, email, phone, address, addressNumber, city, state, zipCode
- `addressNumber`: actualmente solo número positivo; considerar flexibilizar

### Uso de service_role

- Checkout API: `supabaseAdmin` para insert orders, order_items, update preference_id
- Webhook: `supabaseAdmin` para update orders, order_items, products, webhook_logs
- Órdenes usuario: `createServerClient` con cookies (RLS aplica)

---

## Arquitectura

### Flujo checkout → preferencia → pago → webhook

1. **Checkout**: POST con items + customerInfo → orden + order_items + preferencia
2. **Wallet**: initMercadoPago(publicKey), Wallet con preferenceId
3. **MP**: Usuario paga → redirect + webhook
4. **Webhook**: payment.get → update order → (approved) inventario + email

### Config MP: database vs env

- **DB**: `system_config` con config_key/config_value (JSON)
- **Env**: MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_WEBHOOK_SECRET, NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
- **Prioridad**: DB > env
- **test_mode**: true → credenciales test; false → producción

### Sincronización orden e inventario

- **Orden**: status (pending → completed/failed), mercadopago_payment_id, transaction_amount
- **Inventario**: RPC `decrease_product_stock(product_id, quantity)`; fallback: fetch product → update inventory_quantity, stock_quantity
- **Productos con variantes**: order_items tiene variant_id; actualmente el webhook solo usa product_id. Pendiente: soportar variant_id en decrease_product_stock.

---

## Mejores Prácticas

### Manejo de errores y reintentos

- Webhook: try/catch en inventario y email; no propagar error al response
- Checkout: validar antes de crear orden; si MP falla, la orden ya existe (considerar rollback o estado "preference_failed")
- Reintentos: considerar reintentar RPC inventario antes de fallback

### Logging de webhooks

- Insertar en `webhook_logs` al recibir (status: pending)
- Actualizar a success/failed tras procesar
- Incluir event_type, payload, error_message si falla

### Transacciones y consistencia

- Orden + order_items: si order_items falla, la orden queda sin ítems; el webhook podría no tener qué procesar. Evaluar transacción o compensación.
- Inventario: el fallback actualiza products; para variantes, falta lógica en product_variants.

---

## Refactorización

### Cuándo refactorizar

- Webhook con @ts-nocheck → eliminar y tipar
- Checkout sin shipping en preferencia → añadir ítem envío o shipment MP
- Inventario solo product_id → soportar variant_id

### Cómo refactorizar sin romper

1. **Webhook**: Mantener verificación de firma, logging, orden de operaciones (orden → inventario → email)
2. **Checkout**: Mantener external_reference = order.id; no cambiar estructura de preference
3. **Órdenes**: No eliminar campos MP existentes; añadir nuevos si hace falta

---

## Checklist Pre-Commit

- [ ] `npm run lint` pasa
- [ ] `npm run type-check` pasa
- [ ] Si se modificó webhook: verificar firma, idempotencia, no fallar por inventario/email
- [ ] Si se modificó checkout: verificar external_reference, notification_url, back_urls
- [ ] Si se modificó inventario: verificar productos con y sin variantes
- [ ] No exponer secretos (tokens, webhook secret) en logs o respuestas

---

## Referencias

- **Docs del módulo**: `Docs/modules/02-checkout-pagos/MODULE.md`
- **Overview**: `Docs/PROJECT_OVERVIEW.md`
- **MercadoPago**: `Docs/MercadoPagoImplementationPlan.md`
- **Testing**: `Docs/PaymentTestingChecklist.md`
- **E-commerce**: `Docs/modules/01-ecommerce/MODULE.md`
