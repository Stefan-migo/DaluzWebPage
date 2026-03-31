---
name: daluz-cuenta-usuario
description: Guía para el módulo Cuenta de usuario de DA LUZ: perfil, mis pedidos, configuración, favoritos, membresía. Usar al modificar páginas /perfil, /mis-pedidos, /configuracion, /mi-membresia, AccountLayout, LikeContext, o APIs de pedidos del usuario.
---

# Cuenta de usuario - Guía de Desarrollo

## Alcance

**Incluye:** Perfil (edición, avatar), mis pedidos, configuración (seguridad, notificaciones), membresía (UI), favoritos (LikeContext). AccountLayout, AuthContext para updateProfile, API /api/orders.

**No incluye:** Autenticación (login, signup) que vive en módulo 03; checkout que crea pedidos; admin que visualiza clientes y favoritos.

**Trigger terms:** perfil, mi perfil, mis pedidos, configuración, favoritos, membresía, cuenta de usuario, user account, pedidos del usuario.

---

## Reglas de Código

### Convenciones

- **Auth:** Usar `useAuthContext` para `user`, `profile`, `updateProfile`, `refetchProfile`; no `useAuth` directamente.
- **Favoritos:** Usar `useLike` para `likedProducts`, `toggleLike`, `isLiked`; LikeContext gestiona `user_favorites` + localStorage.
- **Validación:** Zod para formularios (perfil, contraseña); `@hookform/resolvers/zod` con react-hook-form.
- **Tipos:** Evitar `any`; usar `Tables<'profiles'>`, `Tables<'orders'>`; tipar props y retornos de funciones.
- **Rutas:** Todas las páginas bajo `(account)` requieren sesión; el layout redirige a `/login` si no hay user.

### Patrones a seguir

- **updateProfile:** Llamar tras guardar formulario; usar `refetchProfile` si se necesita refrescar estado.
- **Pedidos:** Fetch desde `/api/orders` (GET); la API filtra por `user_id` vía sesión.
- **Notificaciones:** Persistir en `profiles` (newsletter_subscribed ya existe); añadir columnas si se extienden preferencias.
- **Membresía:** Consultar `profile?.is_member`, `profile?.membership_tier`; no hardcodear `hasActiveMembership = false`.
- **Favoritos:** LikeContext sincroniza con `user_favorites` si hay sesión; fallback a localStorage para anónimos.

### Anti-patrones a evitar

- No hardcodear `hasActiveMembership`; debe venir de `profile` o API de membresía.
- No usar datos mock en producción para membresía; conectar con `profiles` o tablas de membresía.
- No persistir solo newsletter y olvidar otras preferencias de notificaciones si se muestran en UI.
- No hacer `signOut` como "eliminar cuenta" sin borrar `profiles` y datos asociados.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente; APIs de cuenta usan sesión del usuario.
- No usar `href={item.href as any}`; tipar correctamente las rutas.

---

## Arquitectura

### Estructura esperada

```
AccountLayout (protege rutas)
  ├── useAuthContext() → user, profile, signOut
  ├── Sidebar: Perfil, Pedidos, Membresía, Configuración
  └── {children} → ProfilePage | OrdersPage | MembershipPage | SettingsPage
        │
        ├── ProfilePage: updateProfile, AvatarUpload
        ├── OrdersPage: fetch('/api/orders')
        ├── MembershipPage: datos de profile o API membresía
        └── SettingsPage: supabase.auth.updateUser, updateProfile
```

### Separación de responsabilidades

| Capa | Responsabilidad |
|------|-----------------|
| AccountLayout | Protección de rutas, navegación, signOut |
| AuthContext | user, profile, updateProfile, refetchProfile |
| LikeContext | likedProducts, toggleLike, isLiked (user_favorites + localStorage) |
| Páginas | UI, formularios, fetch de datos específicos |
| API /api/orders | Pedidos del usuario autenticado (filtrado por user_id) |

### Integración con otros módulos

- **Autenticación:** Depende de AuthContext; sin sesión → redirect a /login.
- **Checkout:** Crea pedidos con `user_id`; mis-pedidos los consume.
- **E-commerce:** LikeContext en ProductCard; favoritos en `user_favorites`.
- **Admin:** Visualiza favoritos en `/admin/customers/[id]`; no modifica lógica de cuenta.

---

## Mejores Prácticas

### Seguridad

- **RLS:** `profiles`, `orders`, `order_items`, `user_favorites` tienen políticas por `auth.uid()`; no deshabilitar.
- **API orders:** Validar sesión con `supabase.auth.getUser()`; filtrar siempre por `user_id`.
- **Validación inputs:** Zod en formularios; sanitizar antes de update (evitar XSS en bio, etc.).
- **Contraseña:** `supabase.auth.updateUser({ password })` requiere sesión activa; considerar re-auth si se exige contraseña actual.

### Performance

- **Loading states:** Mostrar Loader2 o skeleton en perfil, pedidos y configuración durante operaciones async.
- **Pedidos:** Evitar refetch innecesario; considerar cache o React Query si la lista crece.
- **Favoritos:** LikeContext ya cachea en memoria; no hacer fetch repetido en cada render.

### Mantenibilidad

- **Límites:** Componentes < 200 líneas; servicios/API < 250 líneas; extraer subcomponentes si se supera.
- **DRY:** Cards de account comparten estilos (`admin-accent-primary`, `shadow-alkimya`); mantener consistencia.
- **Single Responsibility:** Una página, una responsabilidad; extraer `OrderCard`, `NotificationSwitch` si crecen.

### Accesibilidad

- **Labels:** `htmlFor` e `id` en inputs; `Label` de shadcn en formularios.
- **Mensajes de error:** Mostrar en Alert con `AlertDescription`; no solo `console.error`.
- **Navegación:** Links del sidebar con descripción clara; `aria-current` si aplica.
- **Contraste:** Usar clases del sistema de diseño (brand-primary, text-primary, tierra-media).

---

## Refactorización

### Cuándo refactorizar

- `perfil/page.tsx` > 200 líneas → extraer `ProfileForm`, `ProfileSummaryCard`.
- `mis-pedidos/page.tsx` > 200 líneas → extraer `OrderCard`, `OrderDetails`.
- `configuracion/page.tsx` > 200 líneas → extraer `SecurityCard`, `NotificationsCard`.
- `LikeContext` con lógica compleja → extraer `useFavoritesSync` o servicio de favoritos.

### Cómo refactorizar sin romper

1. **updateProfile:** Cambiar campos requiere actualizar `profiles` schema, `database.ts`, y formularios.
2. **API orders:** El select incluye `order_items`; no cambiar estructura sin actualizar frontend.
3. **LikeContext:** Fallback a localStorage es crítico; no eliminar sin migración de datos.
4. **AccountLayout:** `navigationItems` define rutas; añadir/quitar requiere actualizar array y páginas.

---

## Checklist Pre-Commit

- [ ] `npm run type-check` pasa sin errores.
- [ ] `npm run lint` pasa sin errores.
- [ ] No hay `any` nuevos; `as any` eliminado donde sea posible.
- [ ] Si se modificó `profiles`: `src/types/database.ts` sincronizado.
- [ ] Si se añadió preferencia de notificación: persistir en `profiles` o tabla.
- [ ] Loading states en operaciones async (perfil, pedidos, configuración).
- [ ] Formularios validados con Zod; errores mostrados al usuario.
- [ ] `Docs/modules/04-cuenta-usuario/MODULE.md` actualizado si cambió alcance o flujos.
- [ ] RLS verificado si se añadió tabla o columna sensible.

---

## Referencias

- **Docs del módulo:** `Docs/modules/04-cuenta-usuario/MODULE.md`
- **Autenticación:** `Docs/modules/03-autenticacion/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
