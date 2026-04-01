# Plan: Features Pendientes de Membresía y Sanity

**Fecha:** 2026-03-25  
**Estado:** Planificado  
**Prioridad:** Alta

---

## Resumen Ejecutivo

Este plan cubre la implementación de 4 features pendientes:

| #   | Feature                                          | Prioridad | Complejidad | Tiempo Est. |
| --- | ------------------------------------------------ | --------- | ----------- | ----------- |
| 1   | Sanity Studio Deploy Automático (GitHub Actions) | Alta      | Baja        | 2 horas     |
| 2   | Email Automático al Desbloquear Módulo           | Media     | Media       | 4 horas     |
| 3   | Dashboard de Métricas de Membresía               | Media     | Alta        | 6 horas     |
| 4   | Sincronización Clerk ↔ Supabase                 | Alta      | Media       | 4 horas     |

**Tiempo Total Estimado:** ~16 horas (2 días de trabajo)

---

## Feature 1: Sanity Studio Deploy Automático

### Contexto

El Sanity Studio está embebido en la aplicación Next.js (`/studio`). Cada vez que se modifican los schemas, es necesario rebuild y redeploy el studio.

### Estado Actual

- Workflow de CI/CD existe en `.github/workflows/ci.yml`
- Solo hace: lint, type-check, build
- **NO incluye deploy de Sanity Studio**

### Solución Propuesta

Agregar un job al workflow existente que:

1. Build del Sanity Studio (`sanity build`)
2. Deploy usando `sanity deploy --yes`
3. Requiere `SANITY_API_TOKEN` en GitHub Secrets

### Cambios Requeridos

**Archivo:** `.github/workflows/ci.yml`

```yaml
sanity-deploy:
  name: Deploy Sanity Studio
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "npm"

    - name: Install dependencies
      run: npm ci

    - name: Build Sanity Studio
      run: npm run studio:build
      env:
        SANITY_STUDIO_PROJECT_ID: ${{ secrets.SANITY_STUDIO_PROJECT_ID }}
        SANITY_STUDIO_DATASET: ${{ secrets.SANITY_STUDIO_DATASET }}

    - name: Deploy Sanity Studio
      run: npm run studio:deploy -- --yes
      env:
        SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
```

### Dependencias

- `SANITY_STUDIO_PROJECT_ID` en secrets
- `SANITY_STUDIO_DATASET` en secrets
- `SANITY_API_TOKEN` en secrets (generado desde sanity.io/manage)

### Verificación

1. Hacer un cambio menor en un schema (ej: agregar descripción)
2. Push a main
3. Verificar que el workflow corra y termine exitosamente
4. Verificar en `sanity.io/manage` que el deploy se completó

---

## Feature 2: Email Automático al Desbloquear Módulo

### Contexto

Cuando una alumna compra la membresía, tiene acceso a contenido que se "desbloquea" con el tiempo (relative drip). Sería profesional notificar cuando nuevo contenido esté disponible.

### Estado Actual

- Sistema de emails existe (`src/lib/email/notifications.ts`)
- Template de email de bienvenida existe
- **NO hay trigger para detectar desbloqueo de módulo**

### Solución Propuesta

Crear una API route que:

1. Sea callable periódicamente (cron job) o
2. Se ejecute cuando el usuario hace login/visita la página de membresía

**Recomendación:** Ejecutar "lazy" (al visitar) para evitar dependencia de cron externo.

### Arquitectura

```
Usuario visita /mi-membresia
        │
        ▼
Server Component Fetch
        │
        ▼
Verificar módulos desbloqueados vs últimos notificados
        │
        ▼
Si hay nuevos ──▶ Enviar email notificación
        │
        ▼
Guardar "último módulo notificado" en perfil
```

### Campos Requeridos en Supabase

**Tabla:** `profiles`

```sql
ALTER TABLE profiles ADD COLUMN last_notified_module_number INTEGER;
```

### API / Componente a Crear

**Opción A: API Route** (más control, mejor para debugging)

- `src/app/api/membership/check-unlocks/route.ts`

**Opción B: Server Component** (más simple, menos código)

- Modificar `src/app/(account)/mi-membresia/page.tsx` para verificar y enviar

### Template de Email

Sujeto: "✨ Nuevo contenido disponible en tu viaje"

```
¡Tu módulo {moduleNumber} está listo!

Hola {customer_name},

Han pasado {days} días desde tu inscripción y ahora tienes acceso a:

📚 {module_title}
{fase_description}

{siguiente_modulo_info}

Accede aquí: {access_url}

Con amor,
Equipo Da Luz
```

### Archivos a Crear/Modificar

| Archivo                                         | Acción                                  |
| ----------------------------------------------- | --------------------------------------- |
| `src/lib/email/membership-unlock.ts`            | Función para enviar email de desbloqueo |
| `src/app/api/membership/check-unlocks/route.ts` | API route (o modificar page.tsx)        |
| `supabase/migrations/xxx_add_last_notified.sql` | Migration para nuevo campo              |

### Verificación

1. Crear usuario test con `membership_start_date` hace 7 días
2. Visitar `/mi-membresia`
3. Verificar que se envió email (revisar logs o inbox)
4. Verificar que `last_notified_module_number` se actualizó

---

## Feature 3: Dashboard de Métricas de Membresía

### Contexto

El admin actual puede ver clientes individuales pero no tiene visión agregada:

- Cuántas inscripciones este mes
- Tasa de churn (cancelaciones)
- Progreso promedio de las alumnas
- Módulos más/menos accedidos

### Estado Actual

- Admin panel existe (`/admin`)
- Páginas de customers (`/admin/customers`)
- **NO hay dashboard con métricas**

### Solución Propuesta

Crear una nueva página `/admin/dashboard-membership` con:

1. **Cards de Métricas Principales**
   - Total de miembros activos
   - Nuevas inscripciones (mes actual vs anterior)
   - Churn rate (%)
   - Ingresos del mes (si aplica)

2. **Gráficos**
   - Inscripciones por mes (línea)
   - Distribución por fase/módulo actual (barras)
   - Progreso promedio (barras o gauge)

3. **Tabla Resumida**
   - Top 10 miembros más activos
   - Miembros que no han ingresado en X días

### Stack de Visualización

El proyecto ya usa **Recharts** según el system prompt.

### Queries de Supabase Requeridas

```sql
-- Miembros activos
SELECT COUNT(*) FROM profiles WHERE membership_start_date IS NOT NULL;

-- Inscripciones último mes
SELECT COUNT(*) FROM profiles
WHERE membership_start_date >= NOW() - INTERVAL '30 days';

-- Progreso promedio
SELECT AVG(current_module) FROM memberships;
```

### Archivos a Crear/Modificar

| Archivo                                       | Acción                           |
| --------------------------------------------- | -------------------------------- |
| `src/app/admin/dashboard-membership/page.tsx` | Nueva página dashboard           |
| `src/components/admin/membership-metrics.tsx` | Componente de métricas           |
| `src/components/admin/membership-charts.tsx`  | Gráficos con Recharts            |
| `src/lib/admin/membership-stats.ts`           | Queries y lógica de estadísticas |

### Diseño Sugerido

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Dashboard Membresía                                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Activos │  │  Mes     │  │  Churn   │  │ Ingresos │   │
│  │   142    │  │   +18    │  │   3.2%   │  │  $45.2k  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │  Inscripciones/Mes      │  │  Distribución por Fase │   │
│  │  [📈 Chart]             │  │  [📊 Bar Chart]        │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Top 10 Miembros Más Activos                        │   │
│  │  [Tabla con nombre, módulo actual, última visita]   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Verificación

1. Verificar que las cards muestren datos correctos
2. Verificar que los gráficos se rendericen
3. Verificar que la tabla sea clickeable (link al perfil)

---

## Feature 4: Sincronización Clerk ↔ Supabase

### Contexto

El cliente originalmente mencionó usar Clerk para autenticación. La implementación actual usa Supabase Auth. Hay que clarificar qué se usa y sincronizar correctamente.

### Estado Actual

- El proyecto usa **Supabase Auth** (no Clerk)
- `membership_start_date` se guarda en `profiles` de Supabase
- Webhook de MercadoPago actualiza `membership_start_date` en orders
- **NO hay sincronización con Clerk** (porque no se usa Clerk)

### Aclaración Importante

> ⚠️ **Según el código existente, el proyecto usa Supabase Auth, NO Clerk.**

Si el cliente quiere cambiar a Clerk, sería un cambio arquitectural mayor.

### Feature 4a: Sincronización Supabase Auth ↔ Profiles

Esto sí es relevante: asegurar que cuando un usuario se registra via Supabase Auth, se cree el perfil automáticamente.

**Ya existe:** `profiles` tiene trigger `on_auth_user_created`

### Feature 4b: Webhook de Pago → Guardar start_date

El flujo actual debería funcionar:

```
MercadoPago Webhook → /api/checkout/webhook →
  actualiza order → actualiza profiles.membership_start_date
```

Verificar que este flujo esté correcto.

### Feature 4c: Expiración de Membresía

Manejar cuando:

- Usuario deja de pagar (membresía mensual)
- Quiere retomar donde dejó vs resetear

**Requerimiento del cliente (según Notion):**

> _"Generalmente, retomar donde dejó es lo más amoroso con su proceso."_

### Si se Quiere Implementar Clerk (Futuro)

Cambiar de Supabase Auth a Clerk requiere:

1. Instalar `@clerk/nextjs`
2. Migrar usuarios existentes
3. Cambiar todos los `supabase.auth` a `clerk`
4. Recrear webhooks de autenticación
5. Actualizar RLS policies

**Esto es un proyecto de ~2 semanas.**

### Recomendación

Por ahora, asegurar que el flujo existente funcione correctamente:

1. Verificar webhook de pago actualiza `membership_start_date`
2. Agregar logging para debuggear
3. Crear endpoint de "reset" por si el cliente quiere resetear progreso

### Archivos a Verificar

| Archivo                                     | Propósito                    |
| ------------------------------------------- | ---------------------------- |
| `src/app/api/checkout/webhook/route.ts`     | Webhook de MercadoPago       |
| `src/app/api/admin/customers/[id]/route.ts` | PUT actualiza membership     |
| `supabase/migrations/`                      | Trigger on_auth_user_created |

---

## Orden de Implementación Sugerida

```
┌─────────────────────────────────────────────────────────────┐
│  SEMANA 1                                                     │
├─────────────────────────────────────────────────────────────┤
│  Día 1-2                                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Feature 1: Sanity Deploy Automático                    │ │
│  │ • Agregar job al CI/CD                                 │ │
│  │ • Configurar secrets en GitHub                          │ │
│  │ • Probar con cambio dummy                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Día 3-4                                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Feature 2: Email de Desbloqueo                         │ │
│  │ • Crear template email                                  │ │
│  │ • Implementar lógica de verificación                    │ │
│  │ • Testing con usuario test                              │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  SEMANA 2                                                     │
├─────────────────────────────────────────────────────────────┤
│  Día 5-6                                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Feature 3: Dashboard de Métricas                       │ │
│  │ • Crear página admin                                    │ │
│  │ • Implementar cards de métricas                         │ │
│  │ • Agregar gráficos con Recharts                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Día 7-8 (mitad del día)                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Feature 4: Verificación y Mejoras                       │ │
│  │ • Verificar flujo de webhook                           │ │
│  │ • Agregar logging/debug                                │ │
│  │ • Documentar arquitectura                              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Dependencias Entre Features

```
Feature 1 (Sanity Deploy)
    │
    └── Sin dependencias

Feature 2 (Email)
    │
    ├── Requiere: Feature 1 (para ver nuevos schemas en Studio)
    └── Recomendación: Implementar después de Feature 1

Feature 3 (Dashboard)
    │
    ├── Sin dependencias de código
    └── Recomendación: Implementar después de Feature 2

Feature 4 (Sincronización)
    │
    └── Requiere: Entender qué auth se usa (Supabase vs Clerk)
```

---

## Checklist de Implementación

### Feature 1: Sanity Deploy

- [ ] Agregar `sanity-deploy` job a `.github/workflows/ci.yml`
- [ ] Agregar secrets: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_API_TOKEN`
- [ ] Test: Push cambio y verificar deploy

### Feature 2: Email Desbloqueo

- [ ] Crear template email en `src/lib/email/templates/unlock-notification.ts`
- [ ] Crear función `checkAndNotifyNewModules()` en `src/lib/email/membership-unlock.ts`
- [ ] Migration: agregar `last_notified_module_number` a `profiles`
- [ ] Integrar en `/mi-membresia` page
- [ ] Test: Usuario con 7 días, verificar email enviado

### Feature 3: Dashboard Métricas

- [ ] Crear `src/app/admin/dashboard-membership/page.tsx`
- [ ] Crear `src/lib/admin/membership-stats.ts`
- [ ] Implementar cards de métricas
- [ ] Implementar gráficos con Recharts
- [ ] Test: Verificar datos correctos

### Feature 4: Sincronización

- [ ] Audit: Verificar flujo actual de webhook → Supabase
- [ ] Agregar logging para debugging
- [ ] Crear endpoint de "reset progreso" si se requiere
- [ ] Documentar arquitectura de auth

---

## Recursos Externos Necesarios

| Recurso          | Para qué                                           |
| ---------------- | -------------------------------------------------- |
| Sanity API Token | Deploy automático (generar en sanity.io/manage)    |
| Resend API Key   | Email notifications (ya debería estar configurado) |

---

## Riesgos y Mitigaciones

| Riesgo                                     | Probabilidad | Impacto | Mitigación                      |
| ------------------------------------------ | ------------ | ------- | ------------------------------- |
| Sanity token expira                        | Baja         | Medio   | Rotar token y actualizar secret |
| Email llega a spam                         | Media        | Bajo    | Configurar SPF/DKIM en Resend   |
| Dashboard lento con muchos usuarios        | Baja         | Medio   | Pagination y caching            |
| Datos inconsistentes entre auth y profiles | Baja         | Alto    | Trigger on_auth_user_created    |

---

## Decisiones Pendientes (Requiere Confirmación)

1. **¿Se usa Clerk o Supabase Auth?** (Afecta Feature 4)
2. **¿Con qué frecuencia checkear desbloqueos?** (Cada login vs cron)
3. **¿Qué métricas son prioritarias?** (Dashboard puede reducir scope)

---

_Plan creado: 2026-03-25_
_Por: DaLuz CTO_
