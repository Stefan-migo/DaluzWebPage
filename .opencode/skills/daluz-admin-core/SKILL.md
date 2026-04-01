---
name: daluz-admin-core
description: Guía para el módulo Admin Core de DA LUZ. Usar al modificar dashboard, pedidos, productos, categorías, clientes, /admin/* (gestión operativa), APIs admin, AdminNotificationDropdown, CreateManualOrderForm.
---

# Admin Core - Guía de Desarrollo

## Alcance

Este skill aplica al módulo **Admin Core**: dashboard, pedidos, productos, categorías, clientes (gestión operativa diaria). Incluye rutas `/admin`, `/admin/orders`, `/admin/products`, `/admin/categories`, `/admin/customers`, APIs `/api/admin/*` (dashboard, orders, products, customers, notifications) y `/api/categories` cuando se usa desde admin.

---

## Reglas de Código

### Convenciones

- **Componentes:** PascalCase (`CreateManualOrderForm.tsx`)
- **APIs:** Rutas en `src/app/api/admin/` o `src/app/api/categories/`
- **Límites:** Componentes < 200 líneas, servicios/APIs < 250 líneas

### Patrones obligatorios

1. **Autorización admin:** En TODAS las APIs que modifican datos admin:
   ```typescript
   const supabase = await createClient();
   const { data: { user }, error: userError } = await supabase.auth.getUser();
   if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
   if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
   ```

2. **log_admin_activity:** Para operaciones críticas (crear/editar/eliminar pedidos, productos, categorías, clientes):
   ```typescript
   await supabase.rpc('log_admin_activity', {
     action: 'order_status_update',
     entity_type: 'order',
     entity_id: orderId,
     metadata: { previous_status, new_status }
   });
   ```

3. **createClient vs createServiceRoleClient:**
   - Usar `createClient()` para operaciones que requieren sesión de usuario (verificación admin)
   - Usar `createServiceRoleClient()` solo cuando sea estrictamente necesario (ej: crear usuario auth) y SIEMPRE después de verificar admin con createClient

### Anti-patrones a evitar

- ❌ Usar `createServiceRoleClient()` sin verificación previa de `is_admin`
- ❌ Exponer APIs de mutación (POST, PUT, PATCH, DELETE) sin verificación admin
- ❌ Confiar solo en el layout admin para seguridad (las APIs deben validar)
- ❌ Usar `any` en TypeScript; definir tipos explícitos
- ❌ Componentes > 200 líneas sin extracción

---

## Arquitectura

### Estructura esperada

```
src/app/admin/           # Páginas
src/app/api/admin/       # APIs admin (dashboard, orders, products, customers, notifications)
src/app/api/categories/  # Categorías (compartido e-commerce + admin)
src/components/admin/    # Componentes admin (charts, CreateManualOrderForm, AdminNotificationDropdown)
```

### Separación de responsabilidades

- **Páginas:** Fetch de datos, estado local, composición de componentes
- **Componentes:** Presentación, lógica de UI, sin llamadas directas a DB
- **APIs:** Validación, autorización, lógica de negocio, acceso a Supabase

### Integración con otros módulos

| Módulo | Uso en Admin Core |
|--------|-------------------|
| E-commerce | Productos, categorías, `product_variants` |
| Checkout | `orders`, `order_items`, estados de pago |
| Cuenta usuario | `profiles` (clientes), AuthContext |

---

## Mejores Prácticas

### Performance

- Evitar fetches redundantes; considerar React Query/SWR para cache
- Paginación en listados (orders, products, customers)
- Debounce en búsquedas (CreateManualOrderForm ya lo hace)

### Seguridad

- **Verificación admin en todas las APIs admin** — no excepciones
- Validación de inputs (Zod recomendado) antes de persistir
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente
- RLS habilitado en tablas sensibles; políticas admin vía `admin_users`

### Mantenibilidad

- DRY: reutilizar helpers de autorización (considerar middleware centralizado)
- KISS: lógica sencilla y legible
- Single Responsibility: un componente, una responsabilidad

### Accesibilidad

- Labels en formularios
- Roles ARIA en dropdowns y modales
- Contraste de colores (paleta admin: burgundy #AE0000, crema #F0EACE)

---

## Refactorización

### Cuándo refactorizar

- Componente > 200 líneas
- API > 250 líneas
- Código duplicado (ej: verificación admin repetida)
- API sin verificación admin

### Cómo refactorizar sin romper

1. Añadir verificación admin sin cambiar lógica existente
2. Extraer componentes manteniendo props estables
3. Probar con `npm run build` y `npm run type-check` tras cada cambio
4. Para migraciones DB: probar con `npx supabase db reset` localmente primero

---

## Checklist Pre-Commit

Antes de dar por terminado un cambio en Admin Core:

- [ ] Todas las APIs admin verifican `is_admin`
- [ ] Operaciones críticas usan `log_admin_activity` cuando aplique
- [ ] No hay `createServiceRoleClient()` sin verificación admin previa
- [ ] Componentes < 200 líneas (o plan de extracción documentado)
- [ ] Tipos explícitos, sin `any`
- [ ] `npm run lint` pasa
- [ ] `npm run type-check` pasa
- [ ] `npm run build` pasa (si aplica)

---

## Referencias

- **Docs del módulo:** `Docs/modules/10-admin-core/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
- **E-commerce:** `Docs/modules/01-ecommerce/MODULE.md`
- **Checkout:** `Docs/modules/02-checkout-pagos/MODULE.md`
