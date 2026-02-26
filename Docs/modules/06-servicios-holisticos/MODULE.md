# Servicios holísticos - Documentación del Módulo

**Módulo:** 06 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo **Servicios holísticos** cubre la oferta de terapias y experiencias transformadoras de DA LUZ CONSCIENTE:

- **Información y descubrimiento**: Presentar sesiones, talleres, consultas, grupos y procesos integrativos
- **Diferenciación de propuestas**: Cada tipo de servicio tiene su propia página con contenido descriptivo
- **Futura reserva/agenda**: El componente `ServiceCard` incluye `onBookSession` y botón "Reservar" preparados para integración futura; actualmente el módulo es **estático/informativo**

### 1.2 Objetivos de negocio

- Posicionar los servicios holísticos como complemento natural a la biocosmética
- Generar interés y leads mediante contenido descriptivo y CTAs de contacto
- Diferenciar claramente entre servicios puntuales (sesiones, consultas) y procesos de largo plazo (procesos integrativos, membresía)

### 1.3 Objetivos técnicos

- Mantener rutas coherentes entre Header, Footer, homepage y subpáginas
- Estructura de páginas consistente (hero, grid de tipos, CTA)
- Preparar arquitectura para futura integración de reservas/agenda sin refactorización mayor

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción | Estado |
|------|---------|-------------|--------|
| `/servicios` | — | Landing de servicios (hub) | **❌ No existe** |
| `/servicios/consultas` | `src/app/(marketing)/servicios/consultas/page.tsx` | Consultas individuales (análisis, coaching, seguimiento) | ✅ Completa |
| `/servicios/talleres` | `src/app/(marketing)/servicios/talleres/page.tsx` | Talleres experienciales | ⚠️ Placeholder "Próximamente" |
| `/servicios/grupos` | `src/app/(marketing)/servicios/grupos/page.tsx` | Terapias grupales | ⚠️ Placeholder "Próximamente" |
| `/servicios/procesos-integrativos` | `src/app/(marketing)/servicios/procesos-integrativos/page.tsx` | Procesos GENESIS, OASIS, METAMORFOSIS | ✅ Completa |
| `/servicios/sesiones-holisticas` | `src/app/(marketing)/servicios/sesiones-holisticas/page.tsx` | Sesiones Armonía, Reprogramación, Bioequilibrio | ✅ Completa |
| `/servicios/procesos` | — | Hub de procesos (Header) | **❌ No existe** |
| `/servicios/procesos/ciclos-alquimicos` | — | Ciclos alquímicos (Header) | **❌ No existe** |
| `/servicios/procesos/sesiones-integrales` | — | Sesiones integrales (Header) | **❌ No existe** |
| `/servicios/retiros` | — | Retiros (Footer) | **❌ No existe** |
| `/servicios/formaciones` | — | Formaciones (Footer) | **❌ No existe** |
| `/servicios/analisis` | — | Análisis de piel (NavigationMenu) | **❌ No existe** |
| `/servicios/rutinas` | — | Rutinas personalizadas (NavigationMenu) | **❌ No existe** |

**Nota:** Las rutas están bajo `(marketing)/servicios/`, no bajo un route group `(servicios)/`. El `PROJECT_OVERVIEW.md` menciona `(servicios)/` como estructura; en la práctica es `(marketing)/servicios/`.

### 2.2 APIs

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| — | — | **Ninguna actualmente.** El módulo es estático/informativo. No hay reservas ni agenda en base de datos. |

### 2.3 Tablas de base de datos

**Ninguna.** El módulo no persiste datos de servicios ni reservas. Si se implementa reserva/agenda en el futuro, se requerirán tablas como `services`, `appointments`, `service_availability`, etc.

### 2.4 Componentes principales

| Componente | Ubicación | Propósito | Uso actual |
|------------|-----------|-----------|-------------|
| `ServiceCard` | `src/components/ui/brand/ServiceCard.tsx` | Tarjeta de servicio con imagen, precio, duración, CTA "Reservar" | **No usado** en ninguna página; solo exportado en `index.ts` |
| Páginas de servicios | `src/app/(marketing)/servicios/*/page.tsx` | Hero + grid + CTA por tipo de servicio | Consultas, talleres, grupos, procesos-integrativos, sesiones-holisticas |
| `ProcesosIntegrativosIcon` | `src/components/svg/SVGComponents.tsx` | Icono SVG para procesos integrativos | Homepage sección SERVICIOS HOLÍSTICOS |
| `SesionesIcon` | `src/components/svg/SVGComponents.tsx` | Icono SVG para sesiones | Homepage sección SERVICIOS HOLÍSTICOS |
| `MembresiaIcon` | `src/components/svg/SVGComponents.tsx` | Icono SVG para membresía | Homepage (tercera card; pertenece a módulo Membresía) |
| `ServiciosHolisticosBackground` | `src/components/svg/SVGComponents.tsx` | SVG de fondo para sección servicios | Homepage sección SERVICIOS HOLÍSTICOS |

### 2.5 Estilos

| Recurso | Ubicación | Propósito |
|---------|-----------|-----------|
| `section-servicios` | `src/app/globals.css` | `aspect-ratio: 1920.23 / 1080.23` para sección servicios |
| `servicios-holisticos-container` | `src/app/globals.css` | Margen negativo en pantallas ≥1650px; margen 0 en 1280–1649px |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo principal

```
[Usuario] → Homepage (sección SERVICIOS HOLÍSTICOS)
    ├── Procesos Integrativos → /procesos (❌ 404; debería ser /servicios/procesos-integrativos)
    ├── Sesiones Holísticas → /procesos/sesiones-integrales (❌ 404; debería ser /servicios/sesiones-holisticas)
    └── Membresía → /programa-transformacion (✅ módulo Membresía)

[Header] → Menú "Procesos"
    ├── Procesos → /servicios/procesos (❌ 404)
    ├── Ciclos Alquímicos → /servicios/procesos/ciclos-alquimicos (❌ 404)
    └── Sesiones Integrales → /servicios/procesos/sesiones-integrales (❌ 404)

[Footer] → Sección "Servicios"
    ├── Consultas Individuales → /servicios/consultas (✅)
    ├── Terapias Grupales → /servicios/grupos (✅)
    ├── Talleres → /servicios/talleres (✅)
    ├── Retiros → /servicios/retiros (❌ 404)
    └── Formaciones → /servicios/formaciones (❌ 404)

[Páginas de servicios] → CTA "Ver Todos los Servicios"
    └── /servicios (❌ 404)
```

### 3.2 Dependencias con otros módulos

| Módulo | Relación |
|--------|----------|
| **Membresía** | La tercera card de la sección SERVICIOS HOLÍSTICOS en homepage es "MEMBRESÍA: TU ESPACIO DE CRECIMIENTO" y enlaza a `/programa-transformacion`. Conceptualmente pertenece al módulo Membresía, pero comparte espacio visual con servicios. |
| **Marketing** | Las páginas de servicios están en `(marketing)/servicios/`; comparten layout y Header/Footer. |
| **Contacto** | CTAs "Contactar Ahora", "Más Información" enlazan a `/contacto` (si existe). |

### 3.3 Patrones de páginas

Las páginas existentes siguen un patrón común:

1. **Hero**: Fondo con gradiente o `bg-brand-primary`, título, descripción breve
2. **Contenido**: Grid de cards con tipos de servicio (consultas: 3 tipos; procesos-integrativos: GENESIS, OASIS, METAMORFOSIS; sesiones-holisticas: 3 sesiones)
3. **CTA**: Botones "Contactar", "Ver Todos los Servicios", "Iniciar Proceso"
4. **Placeholder**: Talleres y grupos muestran "Próximamente Disponible" con botones deshabilitados

---

## 4. Fortalezas

- **Contenido descriptivo**: Procesos integrativos y sesiones holísticas tienen descripciones detalladas (duración, beneficios, herramientas)
- **Diseño coherente**: Uso de `card-enhanced`, `font-title`, `font-subtitle`, paleta de marca
- **Iconografía propia**: SVG custom (ProcesosIntegrativosIcon, SesionesIcon) en homepage
- **Metadata SEO**: Consultas y talleres tienen `metadata` con title y description
- **ServiceCard preparado**: Interfaz completa (precio, duración, ubicación, `onBookSession`) para futura integración
- **Responsive**: Estilos con breakpoints en `servicios-holisticos-container`

---

## 5. Debilidades y Deuda Técnica

### 5.1 Rutas rotas e inconsistentes

| Origen | Enlace | Destino real | Problema |
|--------|--------|--------------|----------|
| Homepage | `/procesos` | No existe | Debería ser `/servicios/procesos-integrativos` |
| Homepage | `/procesos/sesiones-integrales` | No existe | Debería ser `/servicios/sesiones-holisticas` |
| Header | `/servicios/procesos` | No existe | No hay página hub de procesos |
| Header | `/servicios/procesos/ciclos-alquimicos` | No existe | Contenido podría integrarse en procesos-integrativos |
| Header | `/servicios/procesos/sesiones-integrales` | No existe | Debería apuntar a `/servicios/sesiones-holisticas` |
| Footer | `/servicios/retiros` | No existe | 404 |
| Footer | `/servicios/formaciones` | No existe | 404 |
| Páginas servicios | `/servicios` | No existe | "Ver Todos los Servicios" → 404 |
| NavigationMenu | `/servicios/analisis`, `/servicios/rutinas` | No existen | 404 |

### 5.2 Inconsistencia de nomenclatura

- **Header**: "Procesos" con subrutas `/servicios/procesos/*`
- **Páginas reales**: `/servicios/procesos-integrativos`, `/servicios/sesiones-holisticas`
- **Homepage**: Usa `/procesos` y `/procesos/sesiones-integrales` (sin prefijo `/servicios`)

No hay mapeo claro entre "Procesos" del Header y las páginas existentes.

### 5.3 ServiceCard

- **`href={`/servicios/${id}` as any}`**: Uso de `as any` para evitar error de tipos en `Link`; debería tiparse con `Route` de Next.js o tipo explícito de rutas válidas
- **No utilizado**: El componente está listo pero no se usa en ninguna página; las páginas de servicios usan cards inline o `Card` de shadcn
- **Reserva**: `onBookSession` no tiene implementación; el botón "Reservar" llama al callback si se pasa, pero no hay flujo de reserva

### 5.4 Otras

- **Consultas**: Botón "Próximamente Disponible" deshabilitado; sin flujo de reserva
- **Talleres/Grupos**: Placeholders; sin contenido real
- **Footer `as any`**: `Link href={link.href as any}` en Footer para evitar tipos; mismo patrón que ServiceCard

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Crear landing `/servicios`**: Página hub que liste todos los servicios con links a subpáginas existentes
2. **Corregir links homepage**: Cambiar `/procesos` → `/servicios/procesos-integrativos` y `/procesos/sesiones-integrales` → `/servicios/sesiones-holisticas`
3. **Unificar Header con páginas existentes**: 
   - Opción A: Cambiar Header para que "Procesos" apunte a `/servicios/procesos-integrativos` y "Sesiones Integrales" a `/servicios/sesiones-holisticas`; eliminar o crear `/servicios/procesos/ciclos-alquimicos`
   - Opción B: Crear `/servicios/procesos` como hub que redirija o liste procesos integrativos y sesiones holísticas
4. **Corregir Footer**: Eliminar o crear páginas para `/servicios/retiros` y `/servicios/formaciones`; si no se crean, quitar enlaces del Footer

### 6.2 Prioridad media

5. **Tipar ServiceCard**: Definir tipo `ServiceRoute` con rutas válidas (`/servicios/consultas` | `/servicios/talleres` | `...`) y usar en `href` sin `as any`
6. **Usar ServiceCard**: Si se decide listar servicios en landing `/servicios`, integrar `ServiceCard` con datos estáticos o futura API
7. **Actualizar NavigationMenu**: Si `daLuzNavigationItems` se usa en producción, corregir `/servicios/analisis` y `/servicios/rutinas` a rutas existentes o eliminarlos
8. **Completar talleres y grupos**: Añadir contenido real o mantener placeholder con mensaje claro

### 6.3 Prioridad baja

9. **Reserva/agenda**: Diseñar flujo de reserva (formulario, calendario, integración con backend)
10. **Tests E2E**: Navegación homepage → servicios → subpáginas; verificar ausencia de 404
11. **Documentar route group**: Decidir si mantener `(marketing)/servicios/` o crear `(servicios)/` como en PROJECT_OVERVIEW

---

## 7. Planes en Curso / Roadmap

- **Reservas**: No hay trabajo activo; el módulo es informativo. Si se implementa reserva/agenda, se requerirá:
  - Tablas en Supabase (`services`, `appointments`, `service_availability`)
  - API para crear/consultar citas
  - Integración con calendario (ej. Calendly, Google Calendar, o custom)
- **Contenido**: Talleres y grupos están en "Próximamente"; sin roadmap definido para completarlos
- **Documentación**: Este documento; skill `daluz-servicios-holisticos` para agentes de IA

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios en este módulo

1. **Añadir nueva página de servicio**: Crear `src/app/(marketing)/servicios/[slug]/page.tsx` siguiendo el patrón de consultas o procesos-integrativos (hero, grid, CTA)
2. **Modificar links**: Revisar Header, Footer, homepage y páginas de servicios; actualizar en bloque para mantener consistencia
3. **ServiceCard**: Si se usa, asegurar que `id` coincida con rutas existentes (`consultas`, `talleres`, `grupos`, `procesos-integrativos`, `sesiones-holisticas`)
4. **Iconos**: Añadir nuevos SVG en `SVGComponents.tsx` si se crean nuevos tipos de servicio en homepage

### 8.2 Puntos de atención al modificar

- **Header**: El menú "Procesos" tiene 3 enlaces; cualquier cambio debe reflejarse en desktop y mobile (Sheet)
- **Footer**: La sección "Servicios" tiene 5 enlaces; verificar que todos apunten a páginas existentes
- **Homepage**: La sección SERVICIOS HOLÍSTICOS tiene 3 cards; las dos primeras son servicios, la tercera es membresía
- **ServiceCard**: El `id` se usa en `href`; debe ser slug de ruta válida

### 8.3 Checklist antes de hacer cambios

- [ ] ¿Se añade o modifica una ruta `/servicios/*`? → Actualizar Header, Footer y homepage si aplica
- [ ] ¿Se usa ServiceCard? → Validar que `id` sea ruta existente; tipar `href` sin `any`
- [ ] ¿Se crea nueva página? → Añadir metadata (title, description) para SEO
- [ ] ¿Se modifican links? → Verificar que no queden 404
- [ ] ¿El componente supera 200 líneas? → Planificar extracción

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` — Overview del sistema
- `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` — Sistema de diseño
- `Docs/modules/05-marketing-contenido/MODULE.md` — Módulo marketing (landing, blog)
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` — Guías globales
- `.cursor/skills/daluz-servicios-holisticos/SKILL.md` — Skill del módulo
