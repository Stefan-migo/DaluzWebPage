---
name: daluz-reviews
description: Guía para desarrollar el módulo Reseñas de DA LUZ. Usar al modificar reseñas, reviews, moderación, votación útil, review_helpfulness, ReviewForm, ReviewList, ReviewItem, StarRating, APIs de reviews o admin/reviews.
---

# Reseñas - Guía de Desarrollo

## Alcance

Reseñas de productos, moderación en admin, votación de utilidad ("¿Te resultó útil?"). Integrado en detalle de producto (`/productos/[slug]`).

**Trigger terms:** reseñas, reviews, moderación, votación útil, review_helpfulness, ReviewForm, ReviewList, ReviewItem, StarRating, StarDisplay.

---

## Reglas de Código

### Convenciones

- **ReviewForm**: Recibir `productId`, `userId`, `existingReview` (opcional), `onSuccess`, `onCancel`.
- **ReviewList**: Recibir `productId`, `currentUserId`, `onEditReview`, `onDeleteReview`.
- **ReviewItem**: Recibir `review` (con `id`, `rating`, `title`, `comment`, `is_verified_purchase`, `helpfulness`, `user_id`/`user`), `currentUserId`, `onEdit`, `onDelete`.
- **APIs públicas**: Usar `createServiceRoleClient()` para bypass RLS; validar `user_id` contra sesión cuando corresponda.
- **APIs admin**: Usar `createClient()` + verificar `is_admin` con RPC antes de cualquier operación.

### Patrones a seguir

1. **Crear reseña**:
   ```ts
   // Validar: rating 1-5, user_id, título y comentario no vacíos
   // Verificar: no existe reseña previa del mismo user_id + product_id
   // Insertar: is_verified_purchase (TODO), is_approved según política
   ```

2. **Votación útil**:
   ```ts
   // UNIQUE(review_id, user_id) en review_helpfulness
   // Si existe voto: UPDATE is_helpful; si no: INSERT
   // No votar en reseña propia
   ```

3. **Admin moderación**: Siempre `is_admin` antes de SELECT/UPDATE/DELETE en `reviews`.

### Anti-patrones a evitar

- No confiar en `user_id` del body sin validar contra sesión en APIs públicas.
- No usar `any` en props (`onEditReview`, `onDeleteReview`); definir tipo `Review` explícito.
- No omitir validación de `rating` 1-5 en POST/PUT.
- No exponer `user_id` de votantes en respuestas públicas si no es necesario (privacidad).
- No crear reseñas sin verificar UNIQUE(product_id, user_id).

---

## Arquitectura

### Estructura esperada

```
src/
├── app/
│   ├── admin/reviews/page.tsx      # Panel moderación
│   ├── api/
│   │   ├── admin/reviews/          # GET, [id] DELETE, [id]/approve, [id]/reject
│   │   ├── products/[id]/reviews/ # GET, POST, [reviewId] GET/PUT/DELETE
│   │   └── reviews/[reviewId]/helpful/  # POST, DELETE
│   └── (commerce)/productos/[slug]/page.tsx  # Integración ReviewForm + ReviewList
└── components/ui/reviews/
    ├── ReviewForm.tsx
    ├── ReviewList.tsx
    ├── ReviewItem.tsx
    └── StarRating.tsx  # StarRating + StarDisplay
```

### Separación de responsabilidades

- **ReviewForm**: Solo formulario; no fetchear reseñas.
- **ReviewList**: Fetch, paginación, filtros, orden; delega render a ReviewItem.
- **ReviewItem**: Presentación + votación útil + acciones (editar/eliminar/reportar).
- **APIs**: Validación, autorización, persistencia; sin lógica de UI.

### Integración con el sistema

- **E-commerce**: Reseñas en tab "Reseñas" de detalle de producto.
- **Auth**: `currentUserId` para crear, editar, eliminar, votar.
- **Admin**: Layout con redirect si no `is_admin`; notificaciones en `admin_notifications`.

---

## Mejores Prácticas

### Performance

- Paginación en GET reviews (default `limit=10`).
- Índices en `product_id`, `is_approved`, `created_at` (ya existen).
- Evitar N+1: join `review_helpfulness` en una sola query.

### Seguridad

- **RLS**: Políticas en `reviews` y `review_helpfulness`; admins necesitan política "view all" o usar service_role con verificación previa.
- **Validación**: Rating 1-5, longitud título (255), comentario (1000), `user_id` requerido.
- **Autorización**: `user_id` debe coincidir con sesión en editar/eliminar; `is_admin` en rutas admin.

### Mantenibilidad

- Componentes < 200 líneas; servicios/APIs < 250.
- Tipos explícitos: `Review`, `ReviewSummary`, `ReviewHelpfulness`.
- DRY: Lógica de votación centralizada en API; no duplicar en componentes.

### Accesibilidad

- `StarRating`: `aria-label`, `role="radiogroup"`.
- Botones de votación: etiquetas claras ("¿Te resultó útil?").
- Formulario: labels asociados, mensajes de error visibles.

---

## Refactorización

### Cuándo refactorizar

- Componente > 200 líneas: extraer subcomponentes o hooks.
- Lógica repetida entre ReviewForm y APIs: mover a utilidad o servicio.
- Props con `any`: definir interfaces en `src/types/reviews.ts` o similar.

### Cómo refactorizar sin romper

1. Mantener contratos de API (paths, métodos, body/query).
2. Probar flujo: crear reseña → ver en lista → votar → editar → eliminar.
3. Verificar RLS tras cambios en políticas: `npx supabase db reset`.

---

## Checklist Pre-Commit

- [ ] `rating` validado 1-5 en POST/PUT.
- [ ] `user_id` validado o obtenido de sesión.
- [ ] APIs admin verifican `is_admin`.
- [ ] Sin `any` en props de componentes de reseñas.
- [ ] Componentes bajo 200 líneas.
- [ ] `npm run lint` y `npm run type-check` pasan.
- [ ] Si se modifican migraciones: `npx supabase db reset` exitoso.

---

## Referencias

- **Docs del módulo:** `Docs/modules/08-reviews/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
- **E-commerce (integración):** `Docs/modules/01-ecommerce/MODULE.md`
