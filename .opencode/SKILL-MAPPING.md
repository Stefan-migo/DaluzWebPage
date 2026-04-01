# DaLuz - Agent ↔ Skill Mapping

## Overview

Este documento define el mapeo oficial entre **agentes** (roles/genéricas) y **skills** (conocimiento específico del proyecto DaLuz).

**Regla fundamental:** El agent invoca al skill como **source of truth**. No debe duplicar información que ya existe en el skill.

---

## Mapeo Oficial

| Agente                    | Skills a Invocar                                                               | Trigger                                      |
| ------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| `@frontend-designer`      | `daluz-frontend-ui`                                                            | UI, componentes, diseño, tipografía, colores |
| `@database-specialist`    | `daluz-backend-db`                                                             | Schema, migraciones, queries, RLS            |
| `@code-auditor`           | `daluz-ecommerce-admin`                                                        | Reviews de código, calidad, performance      |
| `@debug-specialist`       | `daluz-ecommerce`, `daluz-checkout-pagos`                                      | Bugs de carrito, checkout, productos         |
| `@security`               | `daluz-autenticacion`, `daluz-checkout-pagos`                                  | Auth, vulnerabilidades, pagos                |
| `@testing`                | `daluz-testing`, `daluz-ecommerce`, `daluz-checkout-pagos`                     | Tests de módulos e-commerce                  |
| `@architect-orchestrator` | `daluz-ecommerce-admin`, `daluz-membresia`, `daluz-backend-db`, `daluz-sanity` | Arquitectura, diseño de features             |
| `@docs-manager`           | `daluz-cuenta-usuario`, `daluz-soporte`, `daluz-marketing-contenido`           | Docs de módulos                              |
| `@devops`                 | `daluz-devops`                                                                 | CI/CD, GitHub Actions, deploys               |
| `@github`                 | `daluz-devops`                                                                 | GitHub, Vercel, PRs, deployments             |
| `@research-specialist`    | (skills generales)                                                             | Analytics, métricas, experimentos            |
| `@notion`                 | (herramienta MCP)                                                              | Notion workspace                             |

---

## Skills Disponibles

### Módulo Frontend/UI

| Skill               | Descripción                                                        | Trigger                         |
| ------------------- | ------------------------------------------------------------------ | ------------------------------- |
| `daluz-frontend-ui` | Design system, tipografía, paleta, botones, animaciones, contraste | Diseño UI, componentes, estilos |

### Módulo E-commerce

| Skill                   | Descripción                                              | Trigger                          |
| ----------------------- | -------------------------------------------------------- | -------------------------------- |
| `daluz-ecommerce`       | Productos, categorías, carrito, ProductCard, CartContext | Carrito, productos, catálogo     |
| `daluz-ecommerce-admin` | Guidelines generales e-commerce + admin                  | Reviews, arquitectura e-commerce |

### Módulo Checkout & Pagos

| Skill                  | Descripción                              | Trigger                      |
| ---------------------- | ---------------------------------------- | ---------------------------- |
| `daluz-checkout-pagos` | Checkout, MercadoPago, webhooks, órdenes | Checkout, pagos, MercadoPago |

### Módulo Autenticación

| Skill                 | Descripción                                       | Trigger                |
| --------------------- | ------------------------------------------------- | ---------------------- |
| `daluz-autenticacion` | Login, signup, OAuth, reset password, AuthContext | Auth, sesión, profiles |

### Módulo Cuenta de Usuario

| Skill                  | Descripción                                          | Trigger                 |
| ---------------------- | ---------------------------------------------------- | ----------------------- |
| `daluz-cuenta-usuario` | Perfil, pedidos, configuración, favoritos, membresía | Cuenta, perfil, pedidos |

### Módulo Membresía

| Skill             | Descripción                                  | Trigger             |
| ----------------- | -------------------------------------------- | ------------------- |
| `daluz-membresia` | Programa 7 meses, módulos, comunidad, planes | Membresía, programa |

### Módulo Marketing & Contenido

| Skill                       | Descripción                                  | Trigger                  |
| --------------------------- | -------------------------------------------- | ------------------------ |
| `daluz-marketing-contenido` | Landing, blog, Alkimya, filosofía, políticas | Landing, blog, marketing |
| `daluz-sanity`              | Schemas, queries GROQ, webhooks, CMS         | Sanity, contenido CMS    |

### Módulo Servicios Holísticos

| Skill                        | Descripción                                | Trigger             |
| ---------------------------- | ------------------------------------------ | ------------------- |
| `daluz-servicios-holisticos` | Sesiones, talleres, consultas, ServiceCard | Servicios, procesos |

### Módulo Admin Core

| Skill              | Descripción                                        | Trigger         |
| ------------------ | -------------------------------------------------- | --------------- |
| `daluz-admin-core` | Dashboard, pedidos, productos, clientes, /admin/\* | Admin operativo |

### Módulo Admin Sistema

| Skill                 | Descripción                                  | Trigger                      |
| --------------------- | -------------------------------------------- | ---------------------------- |
| `daluz-admin-sistema` | Usuarios admin, config, envíos, SEO, backups | Admin sistema, configuración |

### Módulo Backend/DB

| Skill              | Descripción                             | Trigger                 |
| ------------------ | --------------------------------------- | ----------------------- |
| `daluz-backend-db` | Schema, migraciones, RLS, funciones SQL | Base de datos, Supabase |

### Módulo Soporte

| Skill           | Descripción                               | Trigger          |
| --------------- | ----------------------------------------- | ---------------- |
| `daluz-soporte` | Tickets, plantillas, mensajes, categorías | Soporte, tickets |

### Módulo Reviews

| Skill           | Descripción                        | Trigger          |
| --------------- | ---------------------------------- | ---------------- |
| `daluz-reviews` | Reseñas, moderación, votación útil | Reviews, ratings |

### Módulo Notificaciones & Email

| Skill                        | Descripción                                   | Trigger                |
| ---------------------------- | --------------------------------------------- | ---------------------- |
| `daluz-notificaciones-email` | Plantillas email, Resend, admin_notifications | Emails, notificaciones |

---

## Reglas de Uso

### 1. Carga de Skill

Antes de trabajar en cualquier feature, **siempre** cargar el skill correspondiente:

```
@skill daluz-frontend-ui
```

### 2. Source of Truth

- El **skill** es la fuente de verdad para conocimiento del proyecto
- El **agent** tiene el workflow y la lógica de orchestration
- Si hay conflicto, el skill prevalece

### 3. No Duplicación

- El agent **NO** debe duplicar información del skill
- Si el agent tiene info que el skill no tiene, actualizar el skill

### 4. Módulos Combinados

Cuando una feature afecta múltiples módulos, invocar todos los skills relevantes:

```bash
# Checkout afecta e-commerce + checkout
@skill daluz-ecommerce
@skill daluz-checkout-pagos

# Admin de productos afecta admin + e-commerce
@skill daluz-admin-core
@skill daluz-ecommerce
```

---

## Workflow de Trabajo

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO REQUEST                          │
│              "Quiero agregar reseñas a productos"          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CTO (Yo - DaLuz)                        │
│  1. Identificar módulos: reviews + e-commerce               │
│  2. Cargar skills: @skill daluz-reviews                     │
│                         @skill daluz-ecommerce              │
│  3. Delegar a agente apropiado                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND-DESIGNER AGENT                        │
│  - Recibe contexto del skill daluz-reviews                  │
│  - Implementa ReviewForm, ReviewList, ReviewItem           │
│  - Sigue checklist pre-commit del skill                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               CODE-AUDITOR AGENT                             │
│  - Recibe contexto del skill daluz-ecommerce-admin          │
│  - Review del código implementado                           │
│  - Verifica TypeScript, lint, performance                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Ejemplos de Uso

### Diseño de componente UI

```bash
@frontend-designer crea un ReviewCard con la paleta de Alma Terra
# → Agent invoca @skill daluz-reviews + @skill daluz-frontend-ui
```

### Bug en checkout

```bash
@debug-specialist el pago no se completa cuando el usuario usa MercadoPago
# → Agent invoca @skill daluz-checkout-pagos
```

### Nueva tabla en DB

```bash
@database-specialist necesito guardar preferencias de notificación por usuario
# → Agent invoca @skill daluz-backend-db
```

### Feature multi-módulo

```bash
@architect-orchestrator planea el sistema de favoritos para usuarios
# → Agent invoca @skill daluz-ecommerce + @skill daluz-cuenta-usuario
```

---

### Módulo Testing

| Skill           | Descripción                                   | Trigger              |
| --------------- | --------------------------------------------- | -------------------- |
| `daluz-testing` | Unit tests, integration, E2E, mocks, coverage | Testing automatizado |

### Módulo DevOps

| Skill          | Descripción                                 | Trigger         |
| -------------- | ------------------------------------------- | --------------- |
| `daluz-devops` | CI/CD, GitHub Actions, Vercel, environments | DevOps, deploys |

## Referencias

- Directorio de skills: `.opencode/skills/`
- Directorio de agents: `.opencode/agents/`
- Documentación de módulos: `Docs/modules/*/MODULE.md`
- Design system: `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`

---

## Mejoras Pendientes

Por hacer (backlog):

1. **Unificar tipografía** - Reemplazar Malisha por EB Garamond en textos largos según especificación
2. **Auditoría de contraste** - Verificar que todos los textos cumplen WCAG 4.5:1
3. **Unificar botones** - Aplicar estilo `.btn-daluz` a todos los botones de la web
4. **Paletas de líneas de producto** - Implementar consistentemente en todos los componentes de producto
