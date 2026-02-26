# Cuenta de usuario - Documentación del Módulo

**Módulo:** 04 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo **Cuenta de usuario** centraliza la experiencia del cliente autenticado en DA LUZ CONSCIENTE:

- **Perfil**: Información personal, avatar, dirección y datos de contacto
- **Pedidos**: Historial de compras, estado de envío y detalles de pago
- **Configuración**: Seguridad (cambio de contraseña), notificaciones (newsletter, pedidos, membresía) y gestión de cuenta
- **Membresía**: Acceso al programa de transformación de 7 meses (DA LUZ ALKIMYA CONSCIENTE)
- **Favoritos**: Productos guardados (gestionados por `LikeContext`; sin página dedicada en cuenta)

### 1.2 Objetivos de negocio

- Ofrecer un espacio personal donde el cliente gestione su información y preferencias
- Mostrar historial de pedidos para transparencia y soporte post-venta
- Permitir suscripción a newsletter y control de notificaciones
- Preparar la integración del programa de membresía de 7 meses
- Mantener favoritos sincronizados entre sesión y base de datos

### 1.3 Objetivos técnicos

- Rutas protegidas con redirección a `/login` si no hay sesión
- Perfil actualizado en tiempo real vía `AuthContext` y `updateProfile`
- Pedidos filtrados por `user_id` con RLS en API
- Configuración persistida en `profiles` (newsletter, preferencias)
- Código limpio, componentes < 200 líneas, tipos explícitos

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/perfil` | `src/app/(account)/perfil/page.tsx` | Edición de perfil, avatar, dirección, bio |
| `/mis-pedidos` | `src/app/(account)/mis-pedidos/page.tsx` | Listado de pedidos del usuario con detalles |
| `/configuracion` | `src/app/(account)/configuracion/page.tsx` | Seguridad, notificaciones, exportar datos, eliminar cuenta |
| `/mi-membresia` | `src/app/(account)/mi-membresia/page.tsx` | Progreso del programa de 7 meses (datos mock) |

**Layout:** `src/app/(account)/layout.tsx` — Sidebar con navegación, avatar, cierre de sesión y protección de rutas.

**Nota:** No existe ruta `/favoritos` en el área de cuenta. Los favoritos se gestionan en la página de producto (`ProductCard`, `LikeContext`) y se visualizan en admin (`/admin/customers/[id]`).

### 2.2 APIs (endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/orders` | Pedidos del usuario autenticado (filtrado por `user_id` vía sesión) |

**Nota:** Perfil y configuración usan `updateProfile` del `AuthContext` (Supabase client directo). No hay API dedicada para perfil.

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `profiles` | Perfil extendido: nombre, teléfono, avatar, dirección, `newsletter_subscribed`, `membership_tier`, `is_member`, etc. |
| `orders` | Pedidos con `user_id`, `status`, `payment_status`, `total_amount`, `mercadopago_payment_id` |
| `order_items` | Ítems por pedido: `product_name`, `variant_title`, `quantity`, `unit_price` (snapshot al momento del pedido) |
| `user_favorites` | Favoritos: `user_id`, `product_id` (RLS por usuario) |

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|------------|-------------|
| `AccountLayout` | `src/app/(account)/layout.tsx` | Layout con sidebar, navegación, avatar, signOut |
| `ProfilePage` | `src/app/(account)/perfil/page.tsx` | Formulario perfil + AvatarUpload |
| `OrdersPage` | `src/app/(account)/mis-pedidos/page.tsx` | Lista de pedidos con expansión de detalles |
| `SettingsPage` | `src/app/(account)/configuracion/page.tsx` | Cambio contraseña, switches notificaciones, eliminar cuenta |
| `MembershipPage` | `src/app/(account)/mi-membresia/page.tsx` | UI de membresía (mock) |
| `AuthContext` | `src/contexts/AuthContext.tsx` | Provider con `user`, `profile`, `updateProfile`, `refetchProfile` |
| `LikeContext` | `src/contexts/LikeContext.tsx` | Favoritos: `likedProducts`, `toggleLike`, `isLiked` (user_favorites + localStorage) |
| `AvatarUpload` | `src/components/ui/AvatarUpload.tsx` | Subida de avatar con `useFileUpload` |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo de datos principal

```
Usuario autenticado
       │
       ▼
AccountLayout (useAuthContext)
       │
       ├── user, profile, loading
       ├── Redirige a /login si !user
       └── Sidebar: Perfil, Pedidos, Membresía, Configuración
              │
              ├── /perfil ──────► ProfilePage
              │                    └── updateProfile (AuthContext) → profiles
              │
              ├── /mis-pedidos ─► OrdersPage
              │                    └── fetch('/api/orders') → orders + order_items
              │
              ├── /mi-membresia ► MembershipPage (mock)
              │
              └── /configuracion ► SettingsPage
                                   ├── supabase.auth.updateUser (contraseña)
                                   └── updateProfile (newsletter_subscribed)
```

### 3.2 Dependencias con otros módulos

| Módulo | Dependencia |
|--------|-------------|
| **Autenticación (03)** | `AuthContext`, `useAuthContext`, `updateProfile`, `refetchProfile`; redirección a `/login` |
| **Checkout/Pagos (02)** | Pedidos creados en checkout; webhook actualiza `orders.status`; mis-pedidos consume `/api/orders` |
| **E-commerce (01)** | `LikeContext` en ProductCard; favoritos en `user_favorites`; productos en order_items |
| **Admin** | `/admin/customers/[id]` muestra favoritos del cliente; perfiles accesibles por admin |

### 3.3 Flujo de favoritos (LikeContext)

1. **Usuario autenticado**: Carga favoritos desde `user_favorites` (Supabase).
2. **Usuario anónimo**: Carga desde `localStorage` (`daluz-liked-products`).
3. **toggleLike**: Si autenticado → insert/delete en `user_favorites`; si no → localStorage.
4. **Fallback**: Si `user_favorites` no existe (42P01) o no hay sesión → localStorage.
5. **Sincronización**: No hay migración automática de localStorage a DB al hacer login (deuda técnica).

---

## 4. Fortalezas

- **Protección de rutas**: Layout redirige a `/login` si no hay usuario; loading state coherente.
- **Validación robusta**: Zod + react-hook-form en perfil y configuración (contraseña).
- **Perfil completo**: Campos de dirección, bio, fecha nacimiento; AvatarUpload con subida a Supabase Storage.
- **Pedidos funcionales**: API filtra por `user_id`; RLS en orders; UI con badges de estado, detalles expandibles.
- **Configuración útil**: Cambio de contraseña vía Supabase Auth; newsletter persistida en `profiles`.
- **LikeContext resiliente**: Fallback a localStorage si DB falla; soporta usuarios anónimos.
- **RLS en tablas**: `profiles`, `orders`, `order_items`, `user_favorites` con políticas por usuario.
- **Estilos coherentes**: Uso de `brand-primary`, `admin-accent-primary`, `tierra-media`, etc.

---

## 5. Debilidades y Deuda Técnica

### 5.1 Membresía: datos mock y lógica hardcodeada

- `hasActiveMembership = false` hardcodeado en `layout.tsx` (línea 60).
- `mi-membresia/page.tsx` usa `mockMembershipData`; no hay integración con `profiles.is_member`, `membership_tier` ni tablas de membresía.
- **Impacto:** Badge "Miembro Activo" nunca se muestra; página de membresía no refleja datos reales.

### 5.2 Falta página de favoritos en cuenta

- No existe `/favoritos` en el área de cuenta.
- `LikeContext` gestiona favoritos; admin los muestra en `/admin/customers/[id]`.
- **Impacto:** Usuario no puede ver lista de favoritos desde su cuenta; solo desde producto.

### 5.3 Perfil: estadísticas hardcodeadas

- En `perfil/page.tsx` líneas 316-324: "Pedidos: 0" y "Membresías" son valores fijos.
- **Impacto:** No reflejan datos reales (deberían venir de `orders` y `profiles.is_member`).

### 5.4 Configuración: notificaciones no persistidas completamente

- `notifications.orders`, `notifications.sms`, `notifications.membership` no se guardan en `profiles`.
- Solo `newsletter_subscribed` se persiste vía `updateProfile`.
- **Impacto:** Al recargar, switches de pedidos/SMS/membresía vuelven a valores por defecto.

### 5.5 Eliminar cuenta: implementación incompleta

- `handleAccountDeletion` hace `signOut` y redirige; no elimina `profiles` ni datos asociados.
- **Impacto:** Cuenta "eliminada" pero datos permanecen; no cumple RGPD/GDPR para borrado real.

### 5.6 Exportar datos: placeholder

- Botón "Solicitar Exportación" no tiene funcionalidad.
- **Impacto:** Usuario no puede descargar sus datos (requerido en algunas jurisdicciones).

### 5.7 Mis-pedidos: botones sin implementar

- "Explorar Productos" y "Recomprar" no tienen `href` ni `onClick`.
- "Factura" visible solo para `status === 'delivered'` pero orders usa `completed`/`delivered` según webhook.
- **Impacto:** UX incompleta; posible inconsistencia status DB vs UI.

### 5.8 API orders: select con columnas inexistentes

- La API hace `select('*, order_items(*, product_name, variant_title)')`; `product_name` y `variant_title` están en `order_items`, no son joins. Supabase puede interpretar esto correctamente si son columnas de order_items.
- **Verificar:** La respuesta incluye `order_items` con `product_name`, `variant_title`; si funciona, está bien documentado.

### 5.9 Cambio de contraseña: no valida contraseña actual

- `onPasswordSubmit` usa `supabase.auth.updateUser({ password })` sin verificar la contraseña actual.
- Supabase Auth no requiere contraseña actual para `updateUser` en sesión activa; es una decisión de producto.
- **Nota:** El formulario pide "Contraseña actual" pero no se usa; podría eliminarse o usarse para re-autenticación si se implementa.

### 5.10 Tipos `any` y `as any`

- `layout.tsx` línea 139: `href={item.href as any}`.
- `configuracion/page.tsx`: `error: any` en catch.
- **Impacto:** Pérdida de type safety.

---

## 6. Mejoras Propuestas

### Prioridad alta

1. **Implementar check de membresía real**: Usar `profile?.is_member` y `profile?.membership_tier` en layout; conectar `mi-membresia` con datos de `profiles` o tablas de membresía.
2. **Crear página `/favoritos`**: Listar productos favoritos del usuario con `LikeContext` + join a `products`; permitir quitar y navegar a producto.
3. **Persistir preferencias de notificaciones**: Añadir columnas en `profiles` (ej. `notify_orders`, `notify_membership`, `notify_sms`) o JSON `notification_preferences`; guardar en `handleNotificationChange`.
4. **Corregir estadísticas de perfil**: Fetch count de `orders` y usar `profile.is_member` para "Pedidos" y "Membresías".

### Prioridad media

5. **Implementar eliminar cuenta**: Crear API o función que elimine `profiles`, `user_favorites`, y solicite eliminación de `auth.users` (Supabase Admin API); confirmar con contraseña.
6. **Implementar exportar datos**: API que genere JSON con perfil, pedidos, favoritos; ofrecer descarga o envío por email.
7. **Enlazar botones "Explorar Productos" y "Recomprar"**: Añadir `href="/productos"` y lógica de recompra (añadir ítems al carrito).
8. **Sincronizar favoritos al login**: Al detectar sesión, migrar favoritos de localStorage a `user_favorites` si hay IDs en localStorage.

### Prioridad baja

9. **Eliminar `any`**: Tipar `href` en layout; tipar errores en catch.
10. **Unificar estados de pedido**: Documentar mapeo `orders.status` (DB) ↔ UI; asegurar que `delivered` y `completed` se manejen correctamente.
11. **Tests E2E**: Flujo de edición de perfil, cambio de contraseña, visualización de pedidos.

---

## 7. Planes en Curso / Roadmap

- **Membresía**: El módulo `(membresia)` existe en marketing (`/membresia/modulos`); la integración con cuenta está pendiente.
- **PROJECT_OVERVIEW**: Menciona "Revisar RLS en todas las tablas críticas"; `profiles`, `orders`, `user_favorites` tienen RLS; auditar políticas.
- **Documentación modular**: Este MODULE.md es el documento dedicado al módulo 04.

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios en este módulo

1. **Leer primero:** `Docs/PROJECT_OVERVIEW.md`, `Docs/modules/03-autenticacion/MODULE.md` (AuthContext).
2. **Probar con usuario real:** Crear cuenta, hacer pedido de prueba, verificar favoritos.
3. **Verificar RLS:** Cualquier nueva tabla o columna sensible debe tener políticas RLS.
4. **No modificar AuthContext sin coordinar:** El módulo 03 (Autenticación) es dependencia crítica.

### 8.2 Puntos de atención al modificar

| Área | Atención |
|------|----------|
| **Layout account** | `hasActiveMembership` debe venir de `profile` o API de membresía, no hardcodeado. |
| **updateProfile** | Solo actualiza `profiles`; no toca `auth.users`. Campos deben existir en schema. |
| **API /api/orders** | Usa `supabase.auth.getUser()`; cookies deben estar correctas (SSR). |
| **LikeContext** | Fallback a localStorage; no romper flujo para usuarios anónimos. |
| **profiles.newsletter_subscribed** | Usado en configuración; sincronizar con Resend si hay integración. |

### 8.3 Checklist antes de hacer cambios

- [ ] ¿El cambio afecta `profiles`? → Verificar migración y `src/types/database.ts`.
- [ ] ¿Se añade ruta en account? → Añadir a `navigationItems` en layout.
- [ ] ¿Se modifica `updateProfile` o AuthContext? → Revisar consumidores en perfil y configuración.
- [ ] ¿Se crea API nueva? → Validar sesión; filtrar por `user_id`.
- [ ] Ejecutar `npm run type-check` y `npm run lint` antes de commit.

---

## Referencias

- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Autenticación:** `Docs/modules/03-autenticacion/MODULE.md`
- **Checkout/Pagos:** `Docs/modules/02-checkout-pagos/MODULE.md`
- **Skill del proyecto:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
- **Skill del módulo:** `.cursor/skills/daluz-cuenta-usuario/SKILL.md`
- **Migraciones clave:** `20241220000000_create_user_profiles.sql`, `20250116000004_create_user_favorites.sql`, `20241220000001_create_ecommerce_system.sql` (orders, order_items)
