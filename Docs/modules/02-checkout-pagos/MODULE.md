# Checkout & Pagos - Documentación del Módulo

**Módulo:** 02 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo Checkout & Pagos cubre la conversión del carrito en orden de compra y el cobro mediante MercadoPago:

- **Checkout**: Formulario de datos del cliente, dirección de envío, resumen del pedido
- **Preferencia MercadoPago**: Creación de la sesión de pago con ítems, back_urls, notification_url
- **Pago**: Integración con MercadoPago Wallet (SDK React)
- **Webhook**: Recepción de notificaciones MP, actualización de orden, inventario, email
- **Órdenes**: Creación, persistencia, consulta por usuario

### 1.2 Objetivos de negocio

- Permitir que el cliente complete la compra de forma segura
- Cobrar mediante MercadoPago (tarjeta, transferencia, efectivo)
- Registrar órdenes con estado de pago
- Reducir inventario automáticamente al confirmar pago
- Notificar al cliente por email tras pago exitoso

### 1.3 Objetivos técnicos

- Configuración MP desde DB (`system_config`) con fallback a env
- Verificación de firma del webhook en producción
- Idempotencia: el webhook debe poder recibir el mismo evento varias veces
- Manejo robusto de errores (inventario, email no deben bloquear el webhook)

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/checkout` | `src/app/checkout/page.tsx` | Formulario cliente + envío, resumen, botón "Continuar con el pago", Wallet MP |
| `/checkout/success` | `src/app/checkout/success/page.tsx` | Confirmación tras pago exitoso, limpia carrito, enlace a mis-pedidos |
| `/checkout/failure` | `src/app/checkout/failure/page.tsx` | Pago rechazado/cancelado, mensajes por status_detail |

---

### 2.2 APIs (endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/checkout` | Crear orden, order_items, preferencia MP; retorna preference id |
| GET | `/api/checkout?order_id=` | Obtener orden por ID (usado en success) |
| POST | `/api/webhooks/mercadopago` | Recibir notificaciones MP (payment), actualizar orden, inventario, email |
| GET | `/api/webhooks/mercadopago` | Health check del webhook |
| GET | `/api/mercadopago/public-key` | Clave pública MP (test/prod según config) |
| GET | `/api/orders` | Órdenes del usuario autenticado |
| GET/POST | `/api/admin/orders` | Listado y gestión admin |
| GET/PUT | `/api/admin/orders/[id]` | Detalle y actualización de orden |
| POST | `/api/admin/orders/[id]/notify` | Reenviar notificación al cliente |

---

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `orders` | Órdenes (order_number, user_id, email, status, total_amount, campos MP, envío) |
| `order_items` | Ítems (order_id, product_id, variant_id, quantity, unit_price, total_price, product_name, variant_title, sku) |
| `webhook_logs` | Log de webhooks (webhook_type, event_type, payload, status, processed_at) |
| `system_config` | Config MP (access_token, public_key, webhook_secret, test_mode, payment_methods, etc.) |

---

### 2.4 Componentes y librerías

| Ubicación | Descripción |
|-----------|-------------|
| `src/lib/mercadopago/config.ts` | getMercadoPagoConfig, getMercadoPagoAccessToken (DB + env) |
| `src/lib/mercadopago.ts` | Cliente MP, formatArgentinePesos, PAYMENT_STATUS, createArgentinaPreference |
| `src/lib/email/notifications.ts` | EmailNotificationService.sendOrderConfirmation |
| `src/components/admin/PaymentConfig.tsx` | Configuración de pagos en admin |
| `src/components/admin/WebhookMonitor.tsx` | Monitoreo de webhooks |
| `src/components/admin/CreateManualOrderForm.tsx` | Creación manual de órdenes |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo principal

```
Carrito (CartContext) 
  → Checkout (form + resumen) 
  → POST /api/checkout (crear orden + order_items + preferencia MP)
  → Wallet MP (initMercadoPago + preferenceId)
  → Usuario paga en MP
  → MP redirige a /checkout/success o /checkout/failure
  → MP envía POST /api/webhooks/mercadopago
  → Webhook: verifica firma, obtiene payment, actualiza orden, inventario, email
```

### 3.2 Diagrama de flujo

```
[Checkout Page] 
    | items, customerInfo
    v
[POST /api/checkout]
    | 1. Auth (Bearer o cookies)
    | 2. Validar items, customerInfo, addressNumber
    | 3. INSERT orders (pending)
    | 4. INSERT order_items
    | 5. preference.create() → MP
    | 6. UPDATE orders SET mercadopago_preference_id
    v
{ id: preferenceId }
    |
    v
[Wallet MP] → Usuario paga
    |
    v
[MP] → Redirect success/failure + POST webhook
    |
    v
[Webhook]
    | 1. Verificar firma (producción)
    | 2. Log webhook_logs
    | 3. payment.get(id)
    | 4. UPDATE orders (status, mp_payment_id, transaction_amount, etc.)
    | 5. Si approved: sendOrderConfirmation, decrease_product_stock
    | 6. UPDATE webhook_logs status
    v
200 OK
```

### 3.3 Dependencias

| Dependencia | Uso |
|-------------|-----|
| **CartContext** | items, total, clearCart (en success) |
| **AuthContext** | user (checkout requiere login) |
| **EmailNotificationService** | sendOrderConfirmation tras pago aprobado |
| **getMercadoPagoConfig** | Tokens, test_mode, payment_methods, auto_return, binary_mode |
| **getMercadoPagoAccessToken** | Cliente MP en checkout y webhook |
| **getWebhookSecret** | Verificación de firma (DB o env) |

### 3.4 Config MP: database vs env

- **Prioridad**: `system_config` (DB) > variables de entorno
- **Claves**: mercadopago_access_token, mercadopago_public_key, mercadopago_webhook_secret, mercadopago_test_mode, mercadopago_test_*, mercadopago_payment_methods, mercadopago_max_installments, mercadopago_auto_return, mercadopago_binary_mode
- **test_mode**: true → usa credenciales test; false → producción

---

## 4. Fortalezas

| Área | Fortaleza |
|------|-----------|
| **Webhook** | Verificación de firma en producción, logging en webhook_logs, no falla por email/inventario |
| **Checkout API** | Auth por Bearer o cookies, validación de items y customerInfo, order_items con variant_id |
| **Config MP** | DB + env, test_mode, payment_methods configurables |
| **Success page** | Limpia carrito solo tras approved, fetch orden por external_reference |
| **Failure page** | Mensajes por status_detail (cc_rejected_*), opciones de reintento |
| **Fallback inventario** | Si RPC falla, fetch + update directo en products (inventory_quantity, stock_quantity) |
| **Email** | sendOrderConfirmation con plantilla DB, no bloquea webhook si falla |

---

## 5. Debilidades y Deuda Técnica

### 5.1 Problemas detectados

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **@ts-nocheck** | webhook route.ts | Desactiva TypeScript; debería tipar correctamente |
| **Envío no incluido en preferencia** | checkout API | total_amount y preferencia solo tienen ítems; shipping no se cobra vía MP |
| **Inventario sin variant_id** | webhook | decrease_product_stock(product_id, quantity) solo; order_items tiene variant_id; productos con variantes podrían no decrementar stock en product_variants |
| **payment_status en orders** | schema | orders tiene payment_status pero webhook actualiza status; inconsistencia status vs payment_status |
| **Webhook log update** | webhook | update por status='pending' sin filtrar por payment_id puede actualizar log incorrecto |
| **addressNumber estricto** | checkout | Solo acepta número positivo; direcciones como "S/N" o "1234 B" fallan |

### 5.2 Código que necesita refactorización

| Archivo | Problema |
|---------|----------|
| `webhook route.ts` | Eliminar @ts-nocheck, tipar body y paymentInfo |
| `checkout route.ts` | Incluir shipping en orden y preferencia MP |
| `lib/mercadopago.ts` | legacyMercadopagoConfig usa env directo; puede fallar si solo hay config en DB |

### 5.3 Inconsistencias

- **orders.status vs payment_status**: Webhook mapea MP status a orders.status; payment_status no se actualiza explícitamente en el webhook.
- **mercadopago_payment_id**: Migración 20250718 usa BIGINT; MP devuelve string en algunos casos; migraciones posteriores (fix_payment_id_type) intentan corregir.
- **order_number**: Formato `DL-${Date.now()}`; puede colisionar en alta concurrencia.

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Incluir envío en preferencia y orden**  
   - Calcular shipping en API (umbral $50.000, costo $5.000)  
   - Añadir ítem "Envío" en preferencia o usar shipment de MP  
   - Actualizar orders con shipping_amount, total_amount correcto  

2. **Inventario con variant_id**  
   - Si order_item tiene variant_id, llamar decrease_product_stock(product_id, variant_id, quantity) si existe la firma de 3 params  
   - Si no, decrementar product_variants.inventory_quantity directamente en fallback  

3. **Eliminar @ts-nocheck en webhook**  
   - Tipar body con interface (type, data.id)  
   - Tipar paymentInfo con tipos de mercadopago o interface propia  

### 6.2 Prioridad media

4. **Idempotencia explícita**  
   - Antes de actualizar orden, verificar si ya está en estado final (completed, failed, etc.)  
   - Evitar procesar inventario dos veces si MP reenvía el webhook  

5. **addressNumber flexible**  
   - Aceptar "S/N", "1234 B", etc.; validar solo que no esté vacío  

6. **order_number único**  
   - Usar UUID corto o order_number con sufijo aleatorio  

7. **payment_status**  
   - Sincronizar payment_status en webhook según statusMapping  

### 6.3 Prioridad baja

8. **Reintentos en fallback inventario**  
   - Reintentar RPC antes de fallback  

9. **Tests E2E**  
   - Flujo checkout → pago test → success (PaymentTestingChecklist)  

10. **Webhook log por payment_id**  
    - Incluir payment_id en webhook_logs para correlación  

---

## 7. Planes en Curso / Roadmap

- **MercadoPagoImplementationPlan.md**: Fases 1-7; estado ~75% según doc (env, webhook signature, order_items ya implementados)
- **Migración decrease_product_stock**: Conflicto de firmas (2 params vs 3 params) según PROJECT_OVERVIEW
- **PaymentTestingChecklist.md**: Guía de pruebas con tarjetas test MP

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios

| Cambio | Pasos |
|--------|-------|
| **Checkout** | 1) Validar formulario 2) API checkout 3) Preferencia MP 4) Wallet |
| **Webhook** | 1) Verificar firma 2) Log 3) payment.get 4) update order 5) inventario 6) email |
| **Órdenes** | 1) Schema orders/order_items 2) APIs 3) Admin |

### 8.2 Puntos de atención

- **Verificación de firma**: Obligatoria en producción; si falla, 401 y log.
- **Idempotencia**: El webhook puede recibir el mismo evento varias veces; no duplicar inventario.
- **Inventario**: No fallar el webhook si inventario falla; log y continuar.
- **Email**: No fallar el webhook si email falla.
- **Moneda**: ARS siempre.
- **external_reference**: Debe ser order.id para correlacionar pago con orden.

### 8.3 Checklist antes de hacer cambios

- [ ] ¿El cambio afecta al webhook? Verificar firma, idempotencia, no bloquear por inventario/email.
- [ ] ¿Se modifica la preferencia MP? Verificar back_urls, notification_url, external_reference.
- [ ] ¿Se tocan órdenes? Verificar campos MP (mercadopago_payment_id tipo correcto).
- [ ] ¿Se modifica inventario? Verificar productos con/sin variantes.
- [ ] `npm run lint` y `npm run type-check` pasan antes de commit.

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` - Sección 4 (E-commerce), 4.2 (MercadoPago)
- `Docs/MercadoPagoImplementationPlan.md` - Fases, estado, gaps
- `Docs/PaymentTestingChecklist.md` - Tarjetas test, casos de prueba
- `Docs/modules/01-ecommerce/MODULE.md` - Carrito, CartContext
