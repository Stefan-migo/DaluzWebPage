# Backend / Base de datos - Documentación del Módulo

**Módulo:** 13 de 13  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo Backend / Base de datos proporciona la capa de persistencia, seguridad y lógica de negocio en base de datos para DA LUZ CONSCIENTE:

- **Persistencia**: Datos estructurados en PostgreSQL (Supabase) para todos los dominios del sistema
- **Seguridad RLS**: Row Level Security en tablas sensibles para control de acceso por usuario/rol
- **Lógica de negocio en DB**: Funciones SQL para inventario, notificaciones, admin y triggers
- **Integridad**: Constraints, triggers, índices y referencias

### 1.2 Objetivos de negocio

- Garantizar datos consistentes y auditables
- Proteger información sensible (pedidos, perfiles, admin)
- Soportar flujos críticos (checkout, inventario, notificaciones, soporte)

### 1.3 Objetivos técnicos

- Migraciones idempotentes y reproducibles
- RLS en todas las tablas sensibles
- Tipos TypeScript sincronizados con el schema
- Documentación clara para desarrolladores y agentes de IA

---

## 2. Alcance del Módulo

### 2.1 Migraciones (listado cronológico por dominio)

| Fecha | Archivo | Dominio | Descripción |
|-------|---------|---------|-------------|
| 20241220 | `create_user_profiles.sql` | Auth | profiles, handle_new_user, update_updated_at |
| 20241220 | `create_ecommerce_system.sql` | E-commerce | products, product_variants, categories, cart_items, orders, order_items |
| 20241220 | `create_membership_system.sql` | Membresía | membership_plans, memberships, program_modules, lessons, etc. |
| 20250116 | `setup_admin_users.sql` | Admin | admin_users, admin_activity_log, is_admin, get_admin_role |
| 20250116 | `fix_admin_profile.sql` | Admin | Corrección profile/admin |
| 20250116 | `fix_admin_rls.sql` | Admin | RLS sin recursión infinita |
| 20250116 | `create_user_favorites.sql` | Cuenta | user_favorites |
| 20250116 | `fix_user_favorites_policies.sql` | Cuenta | RLS user_favorites |
| 20250116 | `create_support_system.sql` | Soporte | support_tickets, support_messages, support_templates |
| 20250116 | `create_system_admin_tools.sql` | Admin | system_config, system_email_templates, health_metrics |
| 20250117 | `add_missing_email_templates.sql` | Email | Plantillas de email |
| 20250118 | `create_admin_notifications.sql` | Admin | admin_notifications, triggers (pedidos, stock, reseñas) |
| 20250120 | `add_admin_profiles_access.sql` | Admin | RLS profiles para admins |
| 20250125 | `create_storage_buckets.sql` | Storage | product-images, images, uploads |
| 20250125 | `fix_storage_policies.sql` | Storage | Políticas RLS storage |
| 20250125 | `fix_products_rls.sql` | E-commerce | RLS products (service role + authenticated) |
| 20250125 | `add_package_characteristics.sql` | E-commerce | Campos de producto |
| 20250128 | `add_mercadopago_config.sql` | Pagos | config MercadoPago |
| 20250128 | `create_shipping_system.sql` | Envíos | shipping_zones, shipping_rates, shipping_carriers |
| 20250128 | `create_branding_storage.sql` | Storage | Bucket branding |
| 20250128 | `add_seo_config.sql` | SEO | Config SEO |
| 20250128 | `create_webhook_logs.sql` | Webhooks | webhook_logs |
| 20250129 | `add_mercadopago_test_credentials.sql` | Pagos | Credenciales test |
| 20250210 | `add_admin_products_access.sql` | Admin | RLS products (admin) |
| 20250210 | `simplify_admin_roles.sql` | Admin | Rol único 'admin' |
| 20250210 | `add_health_metrics_insert_policy.sql` | Admin | RLS health_metrics |
| 20250210 | `add_optimize_database_function.sql` | Admin | optimize_database() |
| 20250210 | `create_backup_storage_bucket.sql` | Storage | database-backups |
| 20250220 | `enhance_google_oauth_profile.sql` | Auth | handle_new_user mejorado |
| 20250220 | `fix_security_linter_issues.sql` | Varios | decrease_product_stock(3 params), notify_admin_*, RLS |
| 20250716 | `create_reviews_tables.sql` | Reviews | reviews, review_helpfulness |
| 20250716 | `fix_review_notifications.sql` | Admin | Triggers reseñas |
| 20250716 | `add_review_notifications.sql` | Admin | Triggers reseñas |
| 20250716 | `create_storage_buckets.sql` | Storage | avatar, profile-images |
| 20250716 | `add_admin_insert_policies.sql` | Admin | RLS insert |
| 20250716 | `allow_admin_operations.sql` | Admin | Admin operations |
| 20250718 | `add_mercadopago_to_orders.sql` | Pagos | mercadopago_preference_id, mercadopago_payment_id |
| 20250815 | `add_inventory_functions.sql` | Inventario | decrease_product_stock(2 params), stock_movements |
| 20250815 | `fix_mercadopago_schema.sql` | Pagos | transaction_amount, stock_quantity, decrease_product_stock |
| 20250815 | `fix_payment_id_type.sql` | Pagos | Tipo payment_id |
| 20251023 | `add_admin_orders_access.sql` | Admin | RLS orders, order_items |
| 20251027 | `add_admin_delete_policies.sql` | Admin | RLS delete orders |
| 20251027 | `fix_notification_trigger_types.sql` | Admin | Tipos notify_admin_* |
| 20251116 | `remote_commit.sql` | Consolidación | Schema completo remoto |

### 2.2 Tablas principales y relaciones

| Tabla | Propósito | RLS |
|-------|-----------|-----|
| `profiles` | Perfiles de usuario (extiende auth.users) | Sí |
| `products` | Catálogo de productos biocosmecéticos | Sí |
| `product_variants` | Variantes (tamaño, aroma, stock) | Sí |
| `categories` | Categorías de productos | Sí |
| `cart_items` | Carrito (usuario o sesión anónima) | Sí |
| `orders` | Pedidos con integración MercadoPago | Sí |
| `order_items` | Ítems de cada pedido | Sí |
| `reviews` | Reseñas de productos | Sí |
| `stock_movements` | Auditoría de movimientos de inventario | Sí |
| `admin_users` | Usuarios administradores | Sí |
| `admin_notifications` | Notificaciones del sistema | Sí |
| `admin_activity_log` | Registro de actividad admin | Sí |
| `support_tickets` | Tickets de soporte | Sí |
| `support_messages` | Mensajes de tickets | Sí |
| `support_templates` | Plantillas de respuesta | Sí |
| `membership_plans` | Planes de membresía | Sí |
| `memberships` | Membresías activas | Sí |
| `webhook_logs` | Log de webhooks | Sí |
| `shipping_zones` | Zonas de envío | Sí |
| `shipping_rates` | Tarifas de envío | Sí |
| `shipping_carriers` | Transportistas | Sí |
| `user_favorites` | Favoritos de usuario | Sí |


### 2.3 Funciones SQL

| Función | Firma | Propósito |
|---------|-------|-----------|
| `decrease_product_stock` | `(product_id UUID, quantity INTEGER)` | Decrementa stock de producto (productos directos) |
| `decrease_product_stock` | `(p_product_id UUID, p_variant_id UUID, p_quantity INTEGER)` | Decrementa stock de variante (⚠️ conflicto con 2 params) |
| `is_admin` | `(user_id UUID)` | Verifica si usuario es admin |
| `get_admin_role` | `(user_id UUID)` | Obtiene rol del admin |
| `update_updated_at_column` | Trigger | Actualiza `updated_at` |
| `handle_new_user` | Trigger | Crea profile en signup |
| `handle_new_admin_user` | Trigger | Crea admin_user en admin signup |
| `notify_admin_new_order` | `(p_order_id UUID)` | Notifica pedido nuevo |
| `notify_admin_low_stock` | `(p_product_id UUID, p_variant_id UUID, p_current_stock INTEGER)` | Notifica stock bajo |
| `notify_admin_new_review` | `(p_review_id UUID)` | Notifica reseña nueva |
| `generate_ticket_number` | - | Genera número de ticket |
| `mark_notification_read` | `(notification_id UUID)` | Marca notificación leída |
| `optimize_database` | - | Mantenimiento DB |
| `collect_system_health_metrics` | - | Métricas de salud |

### 2.4 Políticas RLS por tabla (resumen)

- **profiles**: Usuario propio, admins pueden ver/actualizar todos
- **products**: Público lectura activos; admins CRUD; service role full access
- **orders**: Usuario propio; admins CRUD
- **admin_users**: Admin users; service role bypass
- **stock_movements**: Solo admins (SELECT, INSERT)
- **support_***: Clientes propios tickets; admins full CRUD
- **storage**: Políticas por bucket (product-images, images, uploads, avatar, branding, database-backups)

### 2.5 Storage buckets

| Bucket | Público | Uso |
|--------|--------|-----|
| `product-images` | Sí | Imágenes de productos |
| `images` | Sí | Imágenes generales |
| `uploads` | Sí | Subidas de usuario |
| `avatar` | Sí | Avatares de perfil |
| `profile-images` | Sí | Imágenes de perfil |
| `branding` | Sí | Assets de marca |
| `database-backups` | No | Backups (solo admins) |

### 2.6 Tipos TypeScript (`src/types/database.ts`)

- `database.ts` define solo `profiles`, `user_favorites`, `products` con tipos Row/Insert/Update
- **Inconsistencia**: `products` en database.ts usa `stock`, `price` (number); schema real usa `inventory_quantity`, `stock_quantity`, `price` (DECIMAL), `slug`, `status`, etc.
- `Functions` y `Enums` están vacíos

### 2.7 Configuración Supabase (`supabase/config.toml`)

- **project_id**: `daluz`
- **db.major_version**: 17
- **db.seed**: `./seed-ecommerce.sql`
- **schemas**: `public`, `graphql_public`
- **Storage buckets**: product-images, images, uploads (configuración explícita)

---

## 3. Arquitectura y Flujos

### 3.1 Orden de migraciones y dependencias

```
profiles (auth) → ecommerce → membership → admin_users → support → shipping → ...
```

Las migraciones se ejecutan en orden alfabético por timestamp. Las dependencias son:
- `update_updated_at_column()` (creada en profiles) usada por todos los triggers
- `stock_movements` creada en 20250815; depende de `products`
- `decrease_product_stock` (2 params) usa `stock_movements`; `decrease_product_stock` (3 params) usa `product_variants.stock` y `stock_movements.variant_id` (inconsistente)

### 3.2 Flujo de datos: cliente → Supabase → RLS → tabla

1. **Cliente**: `createClient()` (anon key) o `createServerClient()` (server con cookies)
2. **Supabase**: Valida JWT, aplica RLS a cada query
3. **RLS**: Políticas evaluadas por fila; si no hay política permitiendo, el acceso se deniega
4. **Service role**: `createServiceRoleClient()` omite RLS; usado en webhooks, APIs admin, operaciones bulk

### 3.3 Uso de service role vs anon key

| Contexto | Cliente | Motivo |
|---------|---------|--------|
| Webhook MercadoPago | Service role directo | Bypass RLS para actualizar orders e inventario |
| API admin/* | `createClient()` (anon) o `createServiceRoleClient()` | Admin: is_admin verifica; algunas rutas usan service role por TODO |
| API pública | `createClient()` (anon) | RLS filtra por status, user_id |
| Reviews, upload | `createServiceRoleClient()` | Necesitan bypass RLS para operaciones específicas |

### 3.4 Dependencias con otros módulos

| Módulo | Dependencia |
|--------|-------------|
| E-commerce | products, product_variants, categories, cart_items |
| Checkout/Pagos | orders, order_items, webhook_logs |
| Admin | admin_users, admin_notifications, admin_activity_log, is_admin |
| Cuenta usuario | profiles, profiles, user_favorites |
| Soporte | support_tickets, support_messages, support_templates |
| Membresía | membership_plans, memberships |
| Notificaciones | admin_notifications, system_email_templates |

---

## 4. Fortalezas

- **RLS**: Tablas sensibles tienen RLS habilitado y políticas explícitas
- **Triggers**: `update_updated_at_column` aplicado consistentemente; triggers de notificación
- **Funciones admin**: `is_admin`, `get_admin_role` con SECURITY DEFINER y `search_path` explícito
- **Migraciones idempotentes**: Uso de `IF EXISTS`, `IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS` en varios archivos
- **Seed**: `seed-ecommerce.sql` con datos de prueba para categorías y productos
- **Config**: Supabase config.toml bien documentado con buckets y puertos

---

## 5. Debilidades y Deuda Técnica

### 5.1 ⚠️ BLOQUEANTE: Conflicto de funciones `decrease_product_stock`

- **Problema**: Múltiples firmas coexisten; migración puede fallar con `function name "decrease_product_stock" is not unique`
- **Origen**: 20250220000001 crea `(p_product_id, p_variant_id, p_quantity)`; 20250815000000 y 20250815230204 crean `(product_id, quantity)`
- **20250815000000** ya incluye `DROP FUNCTION IF EXISTS decrease_product_stock(UUID, INTEGER)` para idempotencia, pero la 3-param sigue existiendo

### 5.2 Inconsistencia `stock_movements`

- **20250220000001** (3-param): Usa `variant_id`, `movement_type = 'sale'`, `quantity` negativo
- **20250815000000** (2-param): Tabla sin `variant_id`; `movement_type = 'decrease'`; `quantity` positivo
- **Schema**: La tabla creada en 20250815 no tiene `variant_id`; la función 3-param intenta insertar en `variant_id`

### 5.3 Dualidad de campos de inventario

- `products.inventory_quantity` (original)
- `products.stock_quantity` (añadido para funciones)
- `product_variants.inventory_quantity` vs `product_variants.stock` (según migración)
- Webhook usa `stock_quantity`; fallback usa ambos

### 5.4 `database.ts` desactualizado

- Solo 3 tablas tipadas; faltan orders, order_items, categories, reviews, admin_*, support_*, etc.
- `products` sin `slug`, `status`, `inventory_quantity`, `stock_quantity`, `price` como DECIMAL
- `Functions` vacío; no hay tipos para RPCs

### 5.5 `createServiceRoleClient` con `any`

- `src/lib/supabase.ts` usa `createClient<any>()` para service role; pierde type safety

### 5.6 Duplicado de migración

- Existe `supabase\migrations\20250815000000_add_inventory_functions.sql` (backslash) en Windows; puede causar confusión

### 5.7 Credenciales hardcodeadas

- `src/lib/supabase.ts` y `src/utils/supabase/server.ts` tienen credenciales de fallback en código

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Resolver conflicto `decrease_product_stock`**: 
   - Opción A: Crear migración que DROP ambas firmas y defina una sola función unificada (p_product_id, p_variant_id NULL, p_quantity) que maneje ambos casos
   - Opción B: Mantener solo 2-param; documentar que variantes no se usan en webhook actual
2. **Unificar schema `stock_movements`**: Añadir `variant_id` opcional si se usa variantes; actualizar funciones
3. **Probar `npx supabase db reset` antes de push

### 6.2 Prioridad media

4. **Sincronizar `database.ts`**: `npx supabase gen types typescript` o manual con todas las tablas y funciones
5. **Tipar `createServiceRoleClient`**: Usar `Database` en lugar de `any`
6. **Eliminar credenciales hardcodeadas**: Usar solo env vars; fallar si faltan

### 6.3 Prioridad baja

7. **Consolidar migraciones**: Unificar migraciones de payment_id, inventory functions en una sola
8. **Documentar RLS por tabla**: Matriz completa en este módulo
9. **Audit RLS**: Revisar que todas las tablas sensibles tengan políticas explícitas

---

## 7. Planes en Curso / Roadmap

- **PROJECT_OVERVIEW 6.1**: Solución aplicada en 20250815000000 (DROP 2-param, ADD COLUMN stock_quantity); verificar con `db reset`
- **PROJECT_OVERVIEW 6.2**: database.ts sincronización, stock_movements, product_variants.stock pendientes
- **Docs**: Este módulo se ampliará con más detalle de RLS y funciones

---

## 8. Guía de Trabajo

### 8.1 Cómo crear/modificar migraciones

1. Crear archivo: `npx supabase migration new <nombre_descriptivo>`
2. Escribir SQL idempotente: `DROP IF EXISTS` antes de `CREATE`, `ADD COLUMN IF NOT EXISTS`
3. Para funciones: `DROP FUNCTION IF EXISTS nombre(tipo1, tipo2)` antes de `CREATE OR REPLACE`
4. Probar con `npx supabase db reset`
5. Verificar en Supabase Studio

### 8.2 Checklist antes de migrar

- [ ] Docker Desktop corriendo (para Supabase local)
- [ ] `npx supabase db reset` ejecuta sin errores
- [ ] No hay conflictos de nombres de funciones (firmas únicas)
- [ ] Tablas referenciadas existen en migraciones anteriores
- [ ] RLS habilitado en tablas nuevas sensibles

### 8.3 Cómo sincronizar database.ts con schema

```bash
# Opción 1: Supabase CLI (si está linkeado)
npx supabase gen types typescript --local > src/types/database.ts

# Opción 2: Manual
# Comparar schema en Supabase Studio con database.ts; añadir tablas, funciones, enums faltantes
```

### 8.4 Puntos de atención al modificar RLS

- **Recursión**: Evitar que políticas RLS llamen a funciones que consultan la misma tabla (ej: is_admin no debe usar admin_users con RLS que dependa de is_admin)
- **Service role**: No necesita políticas; bypass automático
- **Políticas admin**: Usar `is_admin(auth.uid())` o `admin_users` con consulta directa (SECURITY DEFINER)
- **DROP antes de CREATE**: Si cambias políticas, `DROP POLICY IF EXISTS` antes del nuevo `CREATE POLICY`

### 8.5 Referencias

- `Docs/PROJECT_OVERVIEW.md` - Secciones 3 (Base de datos), 6.1 (bloqueante), 6.2 (mejoras)
- `Docs/SUPABASE_CLI_SETUP_GUIDE.md` - Comandos y workflow
- `Docs/LOCAL_SUPABASE_DOCKER_SETUP_WINDOWS.md` - Setup local
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` - Reglas de migraciones
