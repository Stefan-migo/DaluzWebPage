# Admin Core - Documentación del Módulo

**Módulo:** 10 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo **Admin Core** cubre la gestión operativa diaria del negocio DA LUZ CONSCIENTE:

- **Dashboard**: KPIs en tiempo real (ingresos, pedidos, productos, clientes), gráficos de tendencia, alertas de stock bajo
- **Pedidos**: Listado, filtros, cambio de estado, notificación al cliente, pedidos manuales
- **Productos**: Catálogo, inventario, CRUD, operaciones masivas, importación CSV/JSON
- **Categorías**: CRUD de categorías de productos
- **Clientes**: Listado, búsqueda, creación manual, detalle con historial de pedidos

### 1.2 Objetivos de negocio

- Centralizar la operación diaria en un único panel
- Tomar decisiones basadas en métricas reales (ingresos, pedidos pendientes, stock bajo)
- Gestionar pedidos desde recepción hasta envío/entrega
- Mantener el catálogo actualizado (productos, categorías, inventario)
- Atender clientes (crear cuentas manualmente, consultar historial)

### 1.3 Objetivos técnicos

- Verificación `is_admin` en todas las APIs de gestión
- Auditoría de acciones críticas (`log_admin_activity`)
- Integración con E-commerce (productos, categorías), Checkout (pedidos), Cuenta usuario (profiles)
- UI responsive y accesible para uso diario

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin` | `src/app/admin/page.tsx` | Dashboard con KPIs, gráficos, pedidos recientes, alertas stock |
| `/admin/orders` | `src/app/admin/orders/page.tsx` | Listado pedidos, filtros, crear pedido manual |
| `/admin/products` | `src/app/admin/products/page.tsx` | Catálogo, inventario, filtros, bulk |
| `/admin/products/add` | `src/app/admin/products/add/page.tsx` | Añadir producto |
| `/admin/products/edit/[id]` | `src/app/admin/products/edit/[id]/page.tsx` | Editar producto |
| `/admin/products/bulk` | `src/app/admin/products/bulk/page.tsx` | Operaciones masivas |
| `/admin/categories` | `src/app/admin/categories/page.tsx` | CRUD categorías |
| `/admin/customers` | `src/app/admin/customers/page.tsx` | Listado clientes |
| `/admin/customers/[id]` | `src/app/admin/customers/[id]/page.tsx` | Detalle cliente |
| `/admin/customers/[id]/edit` | `src/app/admin/customers/[id]/edit/page.tsx` | Editar cliente |
| `/admin/customers/new` | `src/app/admin/customers/new/page.tsx` | Crear cliente manualmente |

**Nota:** La ruta `/admin/notifications` está referenciada en `AdminNotificationDropdown` pero no existe como página; el enlace "Ver todas las notificaciones" lleva a una ruta inexistente.

### 2.2 APIs (endpoints)

| Método | Endpoint | Verificación admin | Descripción |
|--------|----------|--------------------|-------------|
| GET | `/api/admin/dashboard` | ✅ is_admin | KPIs, gráficos, pedidos recientes, stock bajo |
| GET | `/api/admin/orders` | ✅ | Listar pedidos (filtros, paginación) |
| POST | `/api/admin/orders` | ✅ | Crear pedido manual, get_stats |
| DELETE | `/api/admin/orders` | ✅ | Eliminar todos (testing) |
| GET | `/api/admin/orders/[id]` | ✅ | Pedido individual |
| PATCH | `/api/admin/orders/[id]` | ✅ | Actualizar estado, tracking |
| DELETE | `/api/admin/orders/[id]` | ✅ | Eliminar pedido |
| POST | `/api/admin/orders/[id]/notify` | ✅ | Notificar cliente (email) |
| GET | `/api/admin/products` | ⚠️ Service role sin verificación | Listar productos (ver debilidades) |
| POST | `/api/admin/products` | ⚠️ Sin verificación | Crear producto |
| GET | `/api/admin/products/search` | ✅ | Búsqueda autocompletado |
| POST | `/api/admin/products/bulk` | ✅ | Operaciones masivas |
| POST | `/api/admin/products/import` | ✅ | Importación CSV |
| POST | `/api/admin/products/import-json` | ✅ | Importación JSON |
| GET | `/api/admin/products/template` | ✅ | Template CSV |
| GET | `/api/admin/products/json-template` | ✅ | Template JSON |
| GET | `/api/categories` | ❌ Sin verificación | Listar categorías (público + admin) |
| POST | `/api/categories` | ❌ Sin verificación | Crear categoría |
| GET | `/api/categories/[id]` | N/A | No existe GET por ID |
| PUT | `/api/categories/[id]` | ❌ Sin verificación | Actualizar categoría |
| DELETE | `/api/categories/[id]` | ❌ Sin verificación | Eliminar categoría |
| GET | `/api/admin/customers` | ✅ | Listar clientes |
| POST | `/api/admin/customers` | ✅ | Crear cliente, analytics |
| GET | `/api/admin/customers/[id]` | ✅ | Detalle cliente |
| PATCH | `/api/admin/customers/[id]` | ✅ | Actualizar cliente |
| GET | `/api/admin/customers/search` | ✅ | Búsqueda clientes |
| GET | `/api/admin/notifications` | ✅ | Listar notificaciones |
| PATCH | `/api/admin/notifications` | ✅ | Marcar como leídas |

**Productos (API pública usada por admin):**

| Método | Endpoint | Verificación admin | Descripción |
|--------|----------|--------------------|-------------|
| GET | `/api/products/[id]` | Parcial (includeArchived) | Detalle producto |
| PUT | `/api/products/[id]` | ❌ Sin verificación | Editar producto |
| DELETE | `/api/products/[id]` | ❌ Sin verificación | Archivar producto |

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `orders` | Pedidos con integración MercadoPago |
| `order_items` | Ítems de cada pedido |
| `products` | Catálogo de productos |
| `product_variants` | Variantes (tamaño, aroma, stock) |
| `categories` | Categorías de productos |
| `profiles` | Clientes (extiende auth.users) |
| `admin_users` | Usuarios administradores (is_admin) |
| `admin_notifications` | Notificaciones del panel |
| `admin_activity_log` | Auditoría de acciones admin |

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| AdminNotificationDropdown | `src/components/admin/AdminNotificationDropdown.tsx` | Dropdown de notificaciones en layout admin |
| CreateManualOrderForm | `src/components/admin/CreateManualOrderForm.tsx` | Formulario crear pedido manual (búsqueda cliente/producto) |
| LineChart | `src/components/admin/charts/LineChart.tsx` | Gráfico de líneas (dashboard) |
| AreaChart | `src/components/admin/charts/AreaChart.tsx` | Gráfico de área |
| BarChart | `src/components/admin/charts/BarChart.tsx` | Gráfico de barras |
| ColumnChart | `src/components/admin/charts/ColumnChart.tsx` | Gráfico de columnas |
| PieChart | `src/components/admin/charts/PieChart.tsx` | Gráfico circular |

El dashboard usa Recharts directamente (LineChart, BarChart, PieChart de recharts) en lugar de los componentes custom en `charts/`.

---

## 3. Arquitectura y Flujos

### 3.1 Flujo principal de datos

```
Dashboard → /api/admin/dashboard → orders, products, profiles → KPIs, gráficos, alertas
Pedidos   → /api/admin/orders → orders, order_items → listado, filtros, PATCH estado
Productos → /api/admin/products + /api/products/[id] → products, product_variants
Categorías → /api/categories → categories
Clientes  → /api/admin/customers → profiles
```

### 3.2 Patrón de autorización

- **Layout:** `admin/layout.tsx` verifica `is_admin(user_id)` vía RPC antes de renderizar
- **APIs:** Patrón estándar: `createClient()` → `supabase.auth.getUser()` → `supabase.rpc('is_admin', { user_id })` → 401/403 si falla
- **Excepción:** Algunas APIs usan `createServiceRoleClient()` sin verificación (ver debilidades)

### 3.3 Dependencias

| Módulo | Dependencia |
|--------|-------------|
| E-commerce | Productos, categorías, `product_variants` |
| Checkout | `orders`, `order_items`, `mp_payment_*` |
| Cuenta usuario | `profiles` (clientes), AuthContext |
| Soporte | `admin_notifications` (tipos support_ticket_*) |

### 3.4 Flujo de pedidos

```
Listado → Filtro estado → PATCH → Cambio estado → Email (shipped/delivered)
Crear manual → CreateManualOrderForm → POST /api/admin/orders → orders + order_items
```

### 3.5 Flujo de inventario

- Dashboard: productos con `inventory_quantity <= 5` → alertas
- Productos: `product_variants.inventory_quantity` o `products.inventory_quantity`
- Dualidad: `inventory_quantity` y `stock_quantity` coexisten (compatibilidad)

---

## 4. Fortalezas

- **Dashboard completo:** KPIs reales, gráficos (ingresos 7 días, estado pedidos, top productos), alertas stock bajo
- **Autorización consistente:** Layout admin con `is_admin`, redirect a `/` si no admin, debug mode
- **APIs bien protegidas:** Orders, customers, notifications, products/search, bulk, import tienen verificación `is_admin`
- **Auditoría:** `log_admin_activity` usado en bulk, import, support, admin-users, system
- **Notificaciones:** Polling cada 30s, tipos (order_new, low_stock, new_review, etc.)
- **Pedidos manuales:** CreateManualOrderForm con búsqueda cliente/producto, creación de orden + items
- **Emails:** Notificación envío/entrega al cambiar estado del pedido
- **UI/UX:** Loading states, skeleton, toasts, responsive

---

## 5. Debilidades y Deuda Técnica

### 5.1 Seguridad crítica

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Sin verificación admin** | `/api/admin/products` GET y POST | Cualquiera puede listar/crear productos |
| **Sin verificación admin** | `/api/categories` POST, PUT, DELETE | Cualquiera puede crear/editar/eliminar categorías |
| **Sin verificación admin** | `/api/products/[id]` PUT y DELETE | Cualquiera puede editar/archivar productos |

### 5.2 Código técnico

- **Admin products:** Comentario `TODO: Revert to createClient() after fixing admin_users table` — uso de `createServiceRoleClient()` fue temporal para debugging
- **Admin products POST:** No verifica `is_admin` antes de insertar
- **Ruta inexistente:** `/admin/notifications` referenciada en AdminNotificationDropdown pero no existe página
- **log_admin_activity:** No usado en orders, customers, products (CRUD), categories — solo en bulk, import, support, admin-users, system

### 5.3 Inconsistencias

- **Clientes:** `customer_name: 'Cliente'` genérico en orders (no hay join con profiles para nombre)
- **Inventario:** `inventory_quantity` vs `stock_quantity` vs `product_variants.stock` — duplicación
- **Orders DELETE:** Endpoint para eliminar todos los pedidos (pensado para testing) — riesgo en producción

### 5.4 UX/UI

- Admin layout muy largo (~470 líneas) — incluye AdminSidebar inline
- Dashboard page ~520 líneas — podría extraer componentes

---

## 6. Mejoras Propuestas

### Prioridad alta

1. **Añadir verificación `is_admin`** en `/api/admin/products` (GET, POST), `/api/categories` (POST, PUT, DELETE), `/api/products/[id]` (PUT, DELETE)
2. **Crear página** `/admin/notifications` o eliminar enlace del dropdown
3. **Proteger** o eliminar endpoint DELETE `/api/admin/orders` (eliminar todos)

### Prioridad media

4. **log_admin_activity** en operaciones críticas: orders PATCH, customers POST/PATCH, products POST/PUT, categories POST/PUT/DELETE
5. **Unificar cliente en orders:** Join con profiles para `customer_name` real
6. **Extraer AdminSidebar** del layout a componente separado
7. **Validación con Zod** en APIs admin (orders, products, categories)

### Prioridad baja

8. **Extraer componentes** del dashboard (KPICards, ChartsSection, RecentOrdersSection)
9. **React Query/SWR** para datos remotos (evitar fetch manual en cada página)
10. **Tests E2E** para flujo admin (login, dashboard, orders, products)

---

## 7. Planes en Curso / Roadmap

- Resolver migración `decrease_product_stock` (duplicidad de firmas) — ver PROJECT_OVERVIEW
- Sincronizar `src/types/database.ts` con schema real
- Revertir `createServiceRoleClient` en admin products a `createClient` + `is_admin`

---

## 8. Guía de Trabajo

### Cambios en este módulo

1. **Antes de modificar:** Revisar dependencias con E-commerce, Checkout, Cuenta usuario
2. **APIs:** Siempre añadir `is_admin` en todas las rutas admin
3. **Inventario:** Respetar dualidad `inventory_quantity`/`stock_quantity`; usar RPC `decrease_product_stock` para decrementos
4. **RLS:** Las tablas admin usan RLS; `createClient()` respeta RLS; `createServiceRoleClient()` la omite

### Puntos de atención

- **Autorización:** No confiar solo en layout; las APIs deben verificar
- **Categorías:** `/api/categories` es compartido (e-commerce GET público; admin POST/PUT/DELETE) — debe validar admin en mutaciones
- **Productos:** La edición usa `/api/products/[id]` (API pública) — no admin-only

### Checklist antes de cambios

- [ ] ¿La API verifica `is_admin`?
- [ ] ¿La API valida inputs (Zod, etc.)?
- [ ] ¿La operación crítica usa `log_admin_activity`?
- [ ] ¿Se respeta la integridad de inventario (orders, stock)?
- [ ] ¿El componente supera 200 líneas? (extraer si aplica)
- [ ] `npm run lint` y `npm run type-check` pasan

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` — Sección 5 Sistema Admin
- `Docs/modules/01-ecommerce/MODULE.md` — Dependencias catálogo
- `Docs/modules/02-checkout-pagos/MODULE.md` — Dependencias pedidos
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` — Guía global
- `.cursor/skills/daluz-admin-core/SKILL.md` — Guía del módulo
