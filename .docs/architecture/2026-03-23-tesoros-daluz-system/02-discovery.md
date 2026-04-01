# Discovery Report: Sistema "Tesoros Da Luz"

## 1. Usuario y Job-to-be-Done

### Actor Principal

**Cliente Da Luz** - Usuario que ha realizado una compra de un producto físico o digital que incluye acceso a contenido exclusivo "Tesoros".

### Situación

El usuario ha completado el pago de un producto (ej: "Kit Alkimya", "Línea Umbral") y ahora espera acceder al contenido exclusivo asociado.

### Motivación

- Acceder al contenido exclusivo ("Tesoros") que viene con su compra
- Contenido puede incluir: meditaciones, ejercicios, videos, materiales descargables
- El contenido está en Sanity CMS

### Resultado Deseado

- Ver el contenido de "Tesoros" al que tiene derecho según sus compras
- No ver contenido de productos que no ha comprado

---

## 2. User Journey

### Journey: Acceso a Tesoros post-compra

| Paso | Acción del Usuario                     | Sistema                              | Pain Point                           |
| ---- | -------------------------------------- | ------------------------------------ | ------------------------------------ |
| 1    | Compra producto en e-commerce          | CartContext → Checkout → MercadoPago | ✅ Funciona                          |
| 2    | Completa pago en MercadoPago           | MP procesa payment                   | ✅ Funciona                          |
| 3    | MercadoPago notifica webhook           | POST /api/webhooks/mercadopago       | ⚠️ Falta: guardar treasure access    |
| 4    | Usuario recibe email confirmación      | EmailNotificationService             | ⚠️ Falta: email con acceso a Tesoros |
| 5    | Usuario va a /alkimya/tesoros-daluz    | Página con contenido                 | ❌ **TODO: Filtrar por acceso**      |
| 6    | Ve contenido según productos comprados | Frontend filtra                      | ❌ **TODO: Lógica de filtrado**      |
| 7    | Accede a contenido completo            | Sanity + RLS                         | ❌ **TODO: RLS en Sanity**           |

---

## 3. Success Criteria

| Criterio             | Métrica                                                |
| -------------------- | ------------------------------------------------------ |
| **Acceso correcto**  | Usuario solo ve treasures de productos que ha comprado |
| **Tiempo de acceso** | Contenido disponible < 5 min post-pago                 |
| **Experiencia**      | Mensaje claro si no tiene acceso a ningún treasure     |
| **Seguridad**        | RLS previene acceso no autorizado                      |
| **Escalabilidad**    | Soportar 100+ access_ids sin degradación               |

---

## 4. Bounded Contexts Identificados

### Contexto: E-commerce (EXISTE)

- Products, Orders, Cart
- Integración MercadoPago
- **Gap:** No hay `access_id` en products

### Contexto: Auth & Permissions (EXISTE)

- Supabase Auth
- Profiles, admin_users
- **Gap:** No hay `user_treasures` para guardar accesos

### Contexto: Content (PARCIAL)

- Sanity CMS (membershipContent, productContent)
- **Gap:** No hay `required_id` en schemas

### Nuevo Contexto: Treasures Access (REQUERIDO)

- Tabla `user_treasures`
- Lógica de filtrado
- RLS para acceso

---

## 5. Integración Supabase Auth vs Clerk

**RESUELTO:** Proyecto usa **Supabase Auth**.

### Modelo de Datos Equivalente

```typescript
// Clerk (mencionado en requirements)
user.publicMetadata.treasures = ["linea-umbral", "kit-alkimya"];

// Supabase Auth (IMPLEMENTACIÓN)
interface UserTreasure {
  id: string;
  user_id: string; // FK auth.users
  access_id: string; // ej: 'linea-umbral', 'kit-alkimya'
  product_id: string; // FK products (opcional, para trazabilidad)
  order_id: string; // FK orders (opcional, para trazabilidad)
  granted_at: timestamptz;
  expires_at: timestamptz; // null = permanente
}
```

### Flujo de Actualización Post-Pago

```
MercadoPago Webhook
    ↓ (service_role)
INSERT INTO user_treasures (user_id, access_id, product_id, order_id)
    ↓
Usuario puede ver contenido con required_id = 'linea-umbral'
```
