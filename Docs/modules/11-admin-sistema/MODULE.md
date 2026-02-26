# Admin sistema - Documentación del Módulo

**Módulo:** 11 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### Qué resuelve este módulo

El módulo **Admin sistema** centraliza la configuración operativa y de infraestructura del panel de administración de DA LUZ CONSCIENTE. Permite gestionar:

- **Usuarios administradores:** Crear, editar, desactivar y eliminar administradores; asignar permisos granulares.
- **Configuración del sistema:** Parámetros clave-valor en `system_config` (e-commerce, contacto, inventario, email, pagos).
- **Envíos:** Zonas, tarifas y transportistas para cálculo de costos de envío.
- **SEO:** Metadatos, Open Graph, Twitter Cards, analytics y herramientas de verificación.
- **Pagos:** Credenciales MercadoPago (producción y sandbox), métodos de pago, configuración de checkout.
- **Plantillas de email:** Crear, editar y probar plantillas para comunicaciones automatizadas.
- **Webhooks:** Monitoreo de estado y logs de MercadoPago y Sanity.
- **Salud y mantenimiento:** Métricas de sistema, backups, auditoría de seguridad, optimización de DB.

### Objetivos de negocio

- Permitir que el equipo operativo configure el sistema sin intervención técnica.
- Garantizar trazabilidad de cambios sensibles (config, backups, permisos).
- Facilitar diagnóstico y resolución de incidencias (webhooks, salud, logs).

### Objetivos técnicos

- Centralizar configuración en `system_config` con soporte para valores sensibles.
- Integrar con checkout (shipping/calculate) y webhooks (MercadoPago, Sanity).
- Mantener coherencia con RLS y políticas de `admin_users`.

---

## 2. Alcance del Módulo

### Rutas (páginas)

| Ruta | Descripción |
|------|-------------|
| `/admin/system` | Página principal: configuración, pagos, email, envíos, SEO, webhooks, salud, mantenimiento |
| `/admin/admin-users` | Listado de administradores con filtros y creación |
| `/admin/admin-users/[id]` | Detalle de un administrador |
| `/admin/admin-users/[id]/edit` | Edición de estado y permisos |

### APIs (endpoints)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/admin/admin-users` | GET, POST | Listar y crear administradores |
| `/api/admin/admin-users/[id]` | GET, PUT, DELETE | Detalle, actualizar, eliminar |
| `/api/admin/system/config` | GET, POST, PUT | Configuración del sistema |
| `/api/admin/system/backups` | GET, POST, DELETE | Backups (crear, listar, restaurar, eliminar) |
| `/api/admin/system/health` | GET, POST | Métricas de salud y recolección |
| `/api/admin/system/maintenance` | POST | Acciones: backup, clean_logs, optimize_database, security_audit, test_email, system_status |
| `/api/admin/system/seo/config` | GET, PUT | Configuración SEO |
| `/api/admin/system/shipping/zones` | GET, POST | Zonas de envío |
| `/api/admin/system/shipping/zones/[id]` | GET, PUT, DELETE | Zona por ID |
| `/api/admin/system/shipping/rates` | GET, POST | Tarifas de envío |
| `/api/admin/system/shipping/rates/[id]` | GET, PUT, DELETE | Tarifa por ID |
| `/api/admin/system/shipping/carriers` | GET, POST, PUT, DELETE | Transportistas |
| `/api/admin/system/shipping/calculate` | POST | Calcular costos de envío (zone_id, weight, price) |
| `/api/admin/system/email-templates` | GET, POST | Plantillas de email |
| `/api/admin/system/email-templates/[id]` | GET, PUT, DELETE | Plantilla por ID |
| `/api/admin/system/email-templates/[id]/test` | POST | Enviar email de prueba |
| `/api/admin/system/webhooks/status` | GET | Estado y URLs de webhooks |
| `/api/admin/system/webhooks/test` | POST | Probar webhook (mercadopago, sanity) |
| `/api/admin/system/health` | GET, POST | Métricas de salud |
| `/api/admin/system/payments/test` | POST | Probar conexión MercadoPago |

**⚠️ API no implementada:** `/api/admin/system/webhooks/logs` — Referenciada por `WebhookMonitor` pero no existe. El componente devuelve `logs: []` cuando la petición falla.

### Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `admin_users` | Usuarios con acceso al panel admin (roles, permisos, is_active) |
| `admin_activity_log` | Auditoría de acciones admin |
| `system_config` | Configuración clave-valor (categorías, is_sensitive, value_type) |
| `system_health_metrics` | Métricas de salud (tiempo, memoria, usuarios, etc.) |
| `webhook_logs` | Registro de entregas de webhooks (status, response_code, payload) |
| `shipping_zones` | Zonas geográficas |
| `shipping_rates` | Tarifas por zona (flat, weight, price, free) |
| `shipping_carriers` | Transportistas y tracking |
| `system_email_templates` | Plantillas de email (order_confirmation, password_reset, etc.) |
| **Storage** `database-backups` | Bucket para backups en Supabase |

**Nota:** `system_config_audit` no aparece en migraciones actuales; puede ser planificación futura.

### Componentes principales

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `PaymentConfig` | `src/components/admin/PaymentConfig.tsx` | Credenciales MercadoPago, métodos de pago, webhook URL |
| `EmailTemplatesManager` | `src/components/admin/EmailTemplatesManager.tsx` | Lista, filtros, preview, test de plantillas |
| `EmailTemplateEditor` | `src/components/admin/EmailTemplateEditor.tsx` | Crear/editar plantillas |
| `ShippingManager` | `src/components/admin/ShippingManager.tsx` | CRUD zonas, tarifas, transportistas |
| `WebhookMonitor` | `src/components/admin/WebhookMonitor.tsx` | URLs, estado, logs (filtros) |
| `SEOManager` | `src/components/admin/SEOManager.tsx` | SEO, Open Graph, analytics, sitemap |
| `PermissionsEditor` | `src/components/admin/PermissionsEditor.tsx` | Editor de permisos por recurso (products, orders, etc.) |

---

## 3. Arquitectura y Flujos

### Flujo principal de datos

```
Usuario → Admin Layout (is_admin) → Página /admin/system
         → Tabs: Config, Pagos, Email, Envíos, SEO, Webhooks, Salud, Mantenimiento
         → Componentes → APIs /api/admin/system/* → Supabase (system_config, etc.)
```

### Dependencias con otros módulos

| Módulo | Uso en Admin sistema |
|--------|----------------------|
| **Checkout** | `shipping/calculate` para calcular costos de envío (si se integra en checkout) |
| **Webhooks** | `webhook_logs` se inserta desde `/api/webhooks/mercadopago` y `/api/revalidate` |
| **Pagos** | `system_config` almacena credenciales MercadoPago; `PaymentConfig` las gestiona |
| **Auth** | `admin_users` y `is_admin`/`get_admin_role` para autorización |
| **Email** | `system_email_templates` y Resend para envío de emails |

### Patrones de autorización

- **APIs admin-users:** `get_admin_role(user_id)` → debe ser `'admin'`
- **APIs system:** `is_admin` o `get_admin_role` según el endpoint
- **Config sensible:** `createServiceRoleClient()` para bypass RLS cuando el usuario es admin

### Diagrama de flujo (simplificado)

```
[Admin] → admin/system → [Tabs]
  ├── Config → system/config (GET/PUT)
  ├── Pagos → PaymentConfig → system_config (category: payments)
  ├── Email → EmailTemplatesManager → system_email_templates
  ├── Envíos → ShippingManager → shipping_zones, shipping_rates, shipping_carriers
  ├── SEO → SEOManager → system_config (seo_*)
  ├── Webhooks → WebhookMonitor → webhooks/status, webhooks/logs (404)
  ├── Salud → system/health
  └── Mantenimiento → system/maintenance, system/backups
```

---

## 4. Fortalezas

- **Configuración centralizada:** `system_config` con categorías, valores sensibles y tipos.
- **Permisos granulares:** `admin_users.permissions` y `PermissionsEditor` para control por recurso.
- **Autocomplete para admin-users:** Búsqueda de usuarios registrados antes de crear admin.
- **Seguridad:** Credenciales enmascaradas en UI, uso de `createServiceRoleClient` para config sensible.
- **Backups:** Crear, listar, restaurar, eliminar con bucket `database-backups`.
- **Mantenimiento:** Auditoría de seguridad, optimización DB, limpieza de logs.
- **UI consistente:** Cards, tabs, Badges y diseño admin unificado.
- **WebhookMonitor:** Manejo de errores cuando `/webhooks/logs` no existe (logs vacíos).

---

## 5. Debilidades y Deuda Técnica

### Problemas detectados

1. **Ruta `/api/admin/system/webhooks/logs` inexistente**  
   `WebhookMonitor` la llama; el componente devuelve `logs: []` cuando falla. No hay logs visibles en la UI.

2. **Página `system/page.tsx` muy grande (~1600 líneas)**  
   Supera el límite de 200 líneas por componente. Debería extraerse en subcomponentes o tabs.

3. **Config API sin verificación admin explícita**  
   En `GET` de `/api/admin/system/config` hay comentarios de "bypass admin checks" y no se usa `is_admin` o `get_admin_role` de forma consistente.

4. **`shipping/calculate` sin verificación admin**  
   Endpoint POST para calcular envíos; no valida admin. Si se usa desde checkout público, debería ser intencional; si no, requiere auth.

5. **Inconsistencia en permisos:**  
   `PermissionsEditor` usa `write`/`delete`; `getDefaultPermissions` usa `create`/`update`/`delete`. Posible desalineación en el backend.

6. **Typo en Badge:**  
   En `system/page.tsx` línea ~868: `variant='healty'` debería ser `variant='default'` o similar (no existe `healty`).

7. **system_config_audit**  
   No existe en migraciones; documentación de la especificación menciona la tabla pero no está implementada.

### Código que necesita refactorización

- `src/app/admin/system/page.tsx`: dividir en subcomponentes por tab (ConfigTab, HealthTab, MaintenanceTab, etc.).
- Extraer lógica de backups en un hook o servicio reutilizable.
- Unificar `is_admin` vs `get_admin_role` en APIs admin según el skill daluz-admin-core.

### Inconsistencias

- Algunas APIs usan `is_admin`, otras `get_admin_role`. El skill admin-core recomienda `is_admin` para operaciones generales.
- `PaymentConfig` filtra `configs` por `category === 'payments'`; el sistema usa `system_config` con `category: 'payments'` en algunas migraciones.

---

## 6. Mejoras Propuestas

### Prioridad alta

1. **Implementar `/api/admin/system/webhooks/logs`**  
   GET con query params `type`, `status`, `limit`; devolver `webhook_logs` con paginación.

2. **Refactorizar `system/page.tsx`**  
   Extraer tabs en componentes (ConfigTab, HealthTab, MaintenanceTab, BackupsSection) para cumplir límite de 200 líneas.

3. **Corregir verificación admin en config**  
   Añadir `is_admin` o `get_admin_role` en GET de `/api/admin/system/config` y eliminar comentarios de bypass.

### Prioridad media

4. **Definir política para `shipping/calculate`**  
   Si es público (checkout): documentar y validar inputs. Si es admin: añadir verificación admin.

5. **Unificar acciones de permisos**  
   `write` vs `create`/`update`; alinear con backend y documentar.

6. **Corregir typo Badge**  
   `variant='healty'` → `variant='default'` o crear variante correcta.

7. **Implementar `system_config_audit`**  
   Si se requiere auditoría de cambios en config, crear migración y triggers.

### Prioridad baja

8. **Tests E2E**  
   Crear/editar admin, config, backup, permisos.

9. **Validación con Zod**  
   Inputs en APIs de system (config, backups, permisos).

10. **Permisos granulares en APIs**  
    Verificar `admin_users.permissions` antes de operaciones sensibles (backups, config sensible).

---

## 7. Planes en Curso / Roadmap

- **Backups:** Implementación completa según `Docs/MAINTENANCE_TOOLS_GUIDE.md` (Supabase Storage).
- **Test Email:** Requiere configuración de Resend (dominio de prueba o verificado).
- **Admin User Autocomplete:** Ya implementado según `Docs/ADMIN_USER_AUTOCOMPLETE.md`.
- **Documentación modular:** Este módulo forma parte de la serie de 12 módulos documentados.

---

## 8. Guía de Trabajo

### Cómo abordar cambios en este módulo

1. **Leer primero:** `Docs/PROJECT_OVERVIEW.md`, `.cursor/skills/daluz-ecommerce-admin/SKILL.md`, `.cursor/skills/daluz-admin-sistema/SKILL.md`.
2. **Verificar dependencias:** Cambios en `system_config` afectan PaymentConfig, SEOManager, etc.
3. **Probar migraciones:** `npx supabase db reset` antes de commit.
4. **Validar RLS:** Tablas `admin_users`, `system_config`, `webhook_logs`, `shipping_*` tienen políticas RLS.

### Puntos de atención al modificar

- **Config sensible:** Usar `createServiceRoleClient()` solo tras verificar admin.
- **Backups:** Bucket `database-backups` con políticas RLS para admins.
- **Permisos:** `admin_users.permissions` es JSONB; estructura `{ resource: ['read','write','delete'] }`.
- **Webhook logs:** Tabla `webhook_logs` con políticas para admin y service_role.

### Checklist antes de hacer cambios

- [ ] Verificación admin en todas las APIs de mutación
- [ ] Componentes nuevos < 200 líneas
- [ ] Tipos TypeScript explícitos (evitar `any`)
- [ ] `system_config` con `is_sensitive` para credenciales
- [ ] Probar migraciones localmente
- [ ] Revisar RLS en tablas afectadas

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` — Overview del sistema
- `Docs/MAINTENANCE_TOOLS_GUIDE.md` — Backups y test email
- `Docs/ADMIN_USER_AUTOCOMPLETE.md` — Autocomplete y creación de admins
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` — Guía global del proyecto
- `.cursor/skills/daluz-admin-core/SKILL.md` — Patrones admin core
- `.cursor/skills/daluz-admin-sistema/SKILL.md` — Guía específica de este módulo
