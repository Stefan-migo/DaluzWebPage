# Reseñas - Documentación del Módulo

**Módulo:** 08 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo Reseñas permite a los clientes de DA LUZ CONSCIENTE compartir su experiencia con los productos biocosmecéticos, generando confianza y social proof para futuros compradores. Cubre:

- **Reseñas de productos**: Crear, editar, eliminar reseñas con calificación (1-5 estrellas), título y comentario
- **Moderación**: Panel admin para gestionar, aprobar, rechazar y eliminar reseñas
- **Votación de utilidad**: Sistema "¿Te resultó útil?" (thumbs up/down) para ordenar reseñas por relevancia

### 1.2 Objetivos de negocio

- Generar confianza mediante opiniones reales de clientes
- Ayudar a la decisión de compra con reseñas detalladas
- Moderar contenido inapropiado o spam
- Destacar reseñas útiles para la comunidad

### 1.3 Objetivos técnicos

- APIs REST coherentes para CRUD de reseñas (público y admin)
- Componentes reutilizables con tipos explícitos
- RLS en `reviews` y `review_helpfulness` para seguridad
- Notificaciones admin ante nuevas reseñas

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin/reviews` | `src/app/admin/reviews/page.tsx` | Panel de moderación: listado, filtros, aprobar/rechazar/eliminar |
| `/productos/[slug]` | `src/app/(commerce)/productos/[slug]/page.tsx` | Sección de reseñas embebida (ReviewForm + ReviewList) en tab "Reseñas" |

### 2.2 APIs (endpoints)

#### Admin (requieren `is_admin`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/reviews` | Listar todas las reseñas con filtros (search, status, rating, paginación) |
| DELETE | `/api/admin/reviews/[id]` | Eliminar reseña |
| POST | `/api/admin/reviews/[id]/approve` | Aprobar reseña (`is_approved = true`) |
| POST | `/api/admin/reviews/[id]/reject` | Rechazar reseña (`is_approved = false`) |

#### Públicas (producto)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products/[id]/reviews` | Reseñas aprobadas de un producto (paginación, orden, filtro por rating) |
| POST | `/api/products/[id]/reviews` | Crear reseña (requiere `user_id`, `rating`, `title`, `comment`) |
| GET | `/api/products/[id]/reviews/[reviewId]` | Obtener una reseña específica |
| PUT | `/api/products/[id]/reviews/[reviewId]` | Actualizar reseña propia |
| DELETE | `/api/products/[id]/reviews/[reviewId]` | Eliminar reseña propia (query: `user_id`) |

#### Votación de utilidad

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/reviews/[reviewId]/helpful` | Votar útil/no útil (body: `user_id`, `is_helpful`) |
| DELETE | `/api/reviews/[reviewId]/helpful` | Remover voto (query: `user_id`) |

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `reviews` | Reseñas: `product_id`, `user_id`, `rating`, `title`, `comment`, `is_verified_purchase`, `is_approved`, timestamps. UNIQUE(product_id, user_id). |
| `review_helpfulness` | Votos de utilidad: `review_id`, `user_id`, `is_helpful`. UNIQUE(review_id, user_id). |

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| ReviewForm | `src/components/ui/reviews/ReviewForm.tsx` | Formulario crear/editar reseña (rating, título, comentario) |
| ReviewList | `src/components/ui/reviews/ReviewList.tsx` | Lista con resumen, filtros, orden, paginación |
| ReviewItem | `src/components/ui/reviews/ReviewItem.tsx` | Tarjeta de reseña con votación útil, editar/eliminar/reportar |
| StarRating | `src/components/ui/reviews/StarRating.tsx` | Input interactivo de calificación (1-5) |
| StarDisplay | `src/components/ui/reviews/StarRating.tsx` | Visualización solo lectura de estrellas |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo principal de datos

```
Usuario autenticado → /productos/[slug] → Tab "Reseñas"
  ├── ReviewForm: POST /api/products/[id]/reviews (crear) o PUT (editar)
  └── ReviewList: GET /api/products/[id]/reviews
        └── ReviewItem: POST/DELETE /api/reviews/[reviewId]/helpful (votar)

Admin → /admin/reviews
  └── GET /api/admin/reviews → Aprobar/Rechazar/Eliminar
```

### 3.2 Contextos de cliente Supabase

| Contexto | Cliente | Uso |
|----------|---------|-----|
| Admin | `createClient()` (anon + cookies) | Autenticación de sesión, RPC `is_admin` |
| Público (productos) | `createServiceRoleClient()` | Bypass RLS para leer reseñas aprobadas, crear/actualizar reseñas |

**Nota:** Las APIs públicas de reseñas usan `createServiceRoleClient` porque el cliente anónimo con RLS no podría insertar reseñas si el usuario está autenticado vía cookies en el servidor (el cliente server-side puede no tener la sesión correcta en algunos flujos). El `user_id` se valida en la lógica de la API.

### 3.3 Dependencias con otros módulos

| Módulo | Dependencia |
|--------|-------------|
| **E-commerce** | Reseñas embebidas en detalle de producto (`/productos/[slug]`) |
| **Autenticación** | `user_id` para crear reseñas, votar y editar/eliminar propias |
| **Admin** | `is_admin` para acceso a `/admin/reviews` y APIs admin |
| **Notificaciones** | Trigger `notify_admin_new_review` crea `admin_notifications` en INSERT en `reviews` |

### 3.4 Diagrama de flujo simplificado

```
[Cliente]                    [API]                         [DB]
   |                           |                             |
   |-- POST /reviews --------->|-- insert (service_role) ---->| reviews
   |   (rating, title, comment) |   is_approved: true          |   + trigger
   |                           |                             |   -> admin_notifications
   |<-- 201 -------------------|                             |
   |                           |                             |
   |-- GET /reviews ---------->|-- select (service_role) --->| reviews (is_approved)
   |                           |   + review_helpfulness       |
   |<-- 200 + reviews ---------|                             |
   |                           |                             |
   |-- POST /helpful --------->|-- upsert review_helpfulness->| review_helpfulness
   |   (user_id, is_helpful)   |                             |
```

---

## 4. Fortalezas

- **Validación de inputs**: Rating 1-5, `user_id` requerido, verificación de reseña única por producto/usuario
- **Seguridad admin**: Verificación `is_admin` en todas las rutas `/api/admin/reviews/*`
- **RLS habilitado**: Políticas en `reviews` y `review_helpfulness` para SELECT, INSERT, UPDATE, DELETE
- **Votación de utilidad**: UNIQUE(review_id, user_id) evita votos duplicados; soporte para cambiar voto
- **UX**: Resumen de calificaciones, distribución por estrellas, orden y filtros en ReviewList
- **Accesibilidad**: `StarRating` con `aria-label` y `role="radiogroup"`
- **Notificaciones**: Trigger crea notificación admin en nuevas reseñas
- **Componentes modulares**: Separación clara entre formulario, lista e ítem

---

## 5. Debilidades y Deuda Técnica

### 5.1 Críticas

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Admin no ve reseñas pendientes** | RLS en `reviews` | No existe política "Admins can view all reviews". El admin usa `createClient()` y solo ve `is_approved=true` o propias. Las reseñas pendientes de otros usuarios no se listan. |
| **Botones Aprobar/Rechazar ausentes en UI** | `src/app/admin/reviews/page.tsx` | `handleApproveReview` y `handleRejectReview` existen pero no se renderizan en la tabla. Solo hay "Ver" y "Eliminar". |
| **Filtros pending/rejected idénticos** | `/api/admin/reviews` | `status=pending` y `status=rejected` ambos filtran `is_approved=false`. No hay campo `is_rejected` para distinguir. |

### 5.2 Importantes

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **`is_verified_purchase` siempre false** | `POST /api/products/[id]/reviews` | TODO en código: no se verifica si el usuario compró el producto. Badge "Compra verificada" nunca se muestra. |
| **Auto-aprobación vs moderación** | API POST + migraciones | Las reseñas se crean con `is_approved: true`. Los endpoints approve/reject y el trigger de notificaciones sugieren moderación, pero el flujo actual es auto-publicación. |
| **Nombres de usuario genéricos** | `GET /api/products/[id]/reviews` | No se hace join con `profiles`. ReviewItem muestra "Usuario" para todos; falta `first_name`, `last_name` o email parcial. |
| **ReviewList no refresca tras eliminar** | `productos/[slug]` + ReviewList | `handleDeleteReview` no dispara refetch. La lista queda desactualizada hasta recargar. |

### 5.3 Menores

| Problema | Ubicación |
|----------|-----------|
| Typo "Pendientes (Raras)" | Select estado en admin (probablemente "Pendientes") |
| `onEditReview`/`onDeleteReview` con `any` | ReviewListProps, ReviewItemProps |
| Logs `console.log` en producción | APIs admin |
| Migraciones de notificaciones contradictorias | 01036 vs 01037: una para `is_approved=false`, otra para todas; la última prevalece |

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Política RLS para admins**: Crear `"Admins can view all reviews"` en `reviews` (y `review_helpfulness` si aplica) o usar `createServiceRoleClient` en APIs admin con verificación previa de `is_admin`.
2. **Botones Aprobar/Rechazar en admin**: Mostrar para reseñas con `is_approved=false`; ocultar para ya aprobadas.
3. **Campo `is_rejected` o `status`**: Distinguir pendiente de rechazado; actualizar filtros y lógica de approve/reject.
4. **Refresco tras eliminar**: Pasar callback `onDeleteSuccess` a ReviewList o key que fuerce refetch.

### 6.2 Prioridad media

5. **`is_verified_purchase`**: Consultar `order_items` por `user_id` y `product_id` (o variante) al crear reseña.
6. **Join con profiles**: Incluir `profile:profiles!reviews_user_id_fkey(first_name, last_name)` o equivalente en GET reviews para mostrar nombres.
7. **Moderación real**: Crear reseñas con `is_approved: false` por defecto; que el admin apruebe antes de publicar.
8. **Validación con Zod**: Esquemas para body de POST/PUT en todas las APIs de reseñas.

### 6.3 Prioridad baja

9. **Función Reportar**: Implementar reportes y notificación admin.
10. **Tipos explícitos**: Reemplazar `any` en `onEditReview`, `onDeleteReview` por tipos de reseña.
11. **Reducir logs**: Quitar o condicionar `console.log` en producción.
12. **Tests**: Unitarios para APIs y E2E para flujo de reseñas.

---

## 7. Planes en Curso / Roadmap

- **TODO conocido**: `is_verified_purchase` en POST reviews (comentario en código)
- **Decisión pendiente**: Moderación previa vs auto-aprobación
- **Documentación**: Este módulo y skill `daluz-reviews` para agentes

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios

1. **Leer primero**: `Docs/PROJECT_OVERVIEW.md`, `Docs/modules/08-reviews/MODULE.md`, `.cursor/skills/daluz-reviews/SKILL.md`
2. **Contexto**: Las APIs públicas usan `createServiceRoleClient`; las admin usan `createClient` + `is_admin`. Respetar esta separación.
3. **RLS**: Cualquier cambio en políticas debe probarse con `npx supabase db reset` y usuarios anónimo/autenticado/admin.

### 8.2 Puntos de atención al modificar

- **user_id en APIs públicas**: Nunca confiar en el body sin validar contra la sesión. Obtener `user_id` de `supabase.auth.getUser()` cuando sea posible.
- **review_helpfulness**: UNIQUE(review_id, user_id) — no insertar duplicados; usar upsert o verificar antes.
- **Migraciones**: Las migraciones 01036 y 01037 modifican el mismo trigger; revisar orden y lógica final.

### 8.3 Checklist antes de hacer cambios

- [ ] ¿El cambio afecta RLS? Probar con distintos roles.
- [ ] ¿Se valida `rating` 1-5 y `user_id` en inputs?
- [ ] ¿Los tipos TypeScript están definidos (evitar `any`)?
- [ ] ¿Los componentes siguen el límite de 200 líneas?
- [ ] ¿Se mantiene la coherencia con el sistema de diseño (Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md)?
- [ ] ¿Las APIs admin verifican `is_admin`?

---

## Referencias

- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **E-commerce (integración):** `Docs/modules/01-ecommerce/MODULE.md`
- **Skill del módulo:** `.cursor/skills/daluz-reviews/SKILL.md`
- **UI/UX:** `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`
