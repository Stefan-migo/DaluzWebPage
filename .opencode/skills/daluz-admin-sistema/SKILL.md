---
name: daluz-admin-sistema
description: Guía para el módulo Admin sistema de DA LUZ: usuarios admin, config, envíos, SEO, backups, webhooks. Usar al modificar admin-users, admin/system, system_config, shipping, webhooks, backups, SEOManager, PaymentConfig, WebhookMonitor, PermissionsEditor.
---

# Admin sistema - Guía de Desarrollo

## Alcance

Este skill aplica al módulo **Admin sistema**: usuarios administradores, configuración del sistema, envíos, SEO, backups, webhooks, plantillas de email y pagos. Incluye rutas `/admin/system`, `/admin/admin-users`, APIs `/api/admin/admin-users`, `/api/admin/system/*` y componentes `PaymentConfig`, `EmailTemplatesManager`, `ShippingManager`, `WebhookMonitor`, `SEOManager`, `PermissionsEditor`.

---

## Reglas de Código

### Convenciones específicas del módulo

- **Configuración:** Usar `system_config` para clave-valor; respetar `is_sensitive` y `value_type`.
- **Permisos:** Estructura `{ resource: ['read','create','update','delete'] }` en `admin_users.permissions`.
- **Credenciales:** Nunca loguear ni exponer valores; enmascarar en UI (ej. `PaymentConfig`).
- **APIs admin-users:** Usar `get_admin_role(user_id)` → debe ser `'admin'`.
- **APIs system:** Usar `is_admin` o `get_admin_role` según el endpoint; mantener consistencia con daluz-admin-core.

### Patrones a seguir

1. **Verificación admin en APIs:**
   ```typescript
   const { data: { user }, error: userError } = await supabase.auth.getUser();
   if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
   if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
   ```

2. **Config sensible:**
   ```typescript
   const isSensitive = config_key.includes('token') || config_key.includes('secret') || config_key.includes('key');
   const dbClient = isSensitive ? createServiceRoleClient() : supabase;
   // Usar dbClient solo DESPUÉS de verificar que el usuario es admin
   ```

3. **Log de actividad admin:**
   ```typescript
   await supabase.rpc('log_admin_activity', {
     action: 'update_system_config',
     resource_type: 'system_config',
     resource_id: config_key,
     details: { updated_by: user.email }
   });
   ```

### Anti-patrones a evitar

- ❌ Exponer credenciales en respuestas API o logs
- ❌ Usar `createServiceRoleClient()` sin verificación previa de admin
- ❌ Bypass de verificación admin en config (eliminar comentarios "Temporarily bypass")
- ❌ Componentes > 200 líneas sin extracción
- ❌ Usar `any` en props o retornos de funciones
- ❌ Crear APIs sin validación de inputs (preferir Zod)

---

## Arquitectura

### Estructura esperada

```
src/app/admin/
  system/page.tsx       # Página principal (extraer tabs en subcomponentes)
  admin-users/page.tsx
  admin-users/[id]/page.tsx
  admin-users/[id]/edit/page.tsx

src/app/api/admin/
  admin-users/route.ts
  admin-users/[id]/route.ts
  system/config/route.ts
  system/backups/route.ts
  system/health/route.ts
  system/maintenance/route.ts
  system/seo/config/route.ts
  system/shipping/...
  system/email-templates/...
  system/webhooks/status/route.ts
  system/webhooks/test/route.ts
  system/payments/test/route.ts

src/components/admin/
  PaymentConfig.tsx
  EmailTemplatesManager.tsx
  EmailTemplateEditor.tsx
  ShippingManager.tsx
  WebhookMonitor.tsx
  SEOManager.tsx
  PermissionsEditor.tsx
```

### Separación de responsabilidades

- **Páginas:** Composición de tabs, fetch de datos, estado de diálogos.
- **Componentes:** Lógica de UI, llamadas a APIs; sin acceso directo a Supabase.
- **APIs:** Validación, autorización, lógica de negocio, acceso a DB.

### Integración con el resto del sistema

| Sistema | Integración |
|---------|-------------|
| Checkout | `shipping/calculate` para costos de envío |
| Webhooks | `webhook_logs` insertado desde MercadoPago y Sanity |
| Pagos | `system_config` (mercadopago_*) usado por checkout |
| Auth | `admin_users`, `is_admin`, `get_admin_role` |

---

## Mejores Prácticas

### Performance

- Evitar re-fetches innecesarios; usar estado local para formularios.
- Debounce en inputs de credenciales (ej. PaymentConfig: 800ms).
- Paginación en listados largos (webhook logs, backups).

### Seguridad

- RLS habilitado en `admin_users`, `system_config`, `webhook_logs`, `shipping_*`, `system_email_templates`.
- Config sensible: `is_sensitive = true`; usar service role solo tras verificar admin.
- Validar y sanitizar inputs; evitar inyección en `system_config`.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente.

### Mantenibilidad

- Componentes < 200 líneas; extraer tabs y secciones.
- Tipos explícitos para `SystemConfig`, `HealthMetric`, `WebhookLog`, etc.
- Documentar APIs en MODULE.md al añadir endpoints.

### Accesibilidad

- Labels en formularios; aria-labels en botones de acción.
- Contraste y focus visible en admin (paleta existente).

---

## Refactorización

### Cuándo refactorizar

- Página o componente > 200 líneas.
- Lógica duplicada entre tabs o componentes.
- APIs con responsabilidades mezcladas.

### Cómo refactorizar sin romper

1. Extraer tabs en componentes (`ConfigTab`, `HealthTab`, `MaintenanceTab`).
2. Mover lógica de backups a hook `useBackups` o servicio.
3. Mantener interfaces de props estables; no cambiar firmas de APIs sin deprecación.
4. Probar migraciones con `npx supabase db reset` tras cambios en schema.

---

## Checklist Pre-Commit

- [ ] Verificación admin en todas las APIs de mutación (POST, PUT, DELETE)
- [ ] Componentes nuevos < 200 líneas
- [ ] Tipos TypeScript explícitos; sin `any`
- [ ] Config sensible con `is_sensitive` y service role cuando aplique
- [ ] Migraciones probadas localmente
- [ ] RLS revisado en tablas modificadas
- [ ] `npm run lint` y `npm run type-check` sin errores

---

## Referencias

- **Docs del módulo:** `Docs/modules/11-admin-sistema/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Mantenimiento:** `Docs/MAINTENANCE_TOOLS_GUIDE.md`
- **Admin users:** `Docs/ADMIN_USER_AUTOCOMPLETE.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
- **Skill admin core:** `.cursor/skills/daluz-admin-core/SKILL.md`
