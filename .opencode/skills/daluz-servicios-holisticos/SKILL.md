---
name: daluz-servicios-holisticos
description: Guía para desarrollar el módulo Servicios holísticos de DA LUZ: sesiones, talleres, consultas, grupos, procesos integrativos. Usar al modificar ServiceCard, páginas /servicios/*, sección servicios en homepage, o implementar reservas/agenda.
---

# Servicios holísticos - Guía de Desarrollo

## Alcance

**Incluye:** Sesiones, talleres, consultas, grupos, procesos integrativos, formaciones, retiros.

**No incluye:** Membresía/programa de 7 meses (módulo separado en `/programa-transformacion`, `/mi-membresia`).

**Estado actual:** Contenido informativo estático. Futura reserva/agenda planificada pero no implementada.

---

## Reglas de Código

### Convenciones

- **Rutas:** Todas bajo `/servicios/*`. No usar `/procesos` sin prefijo (causa 404).
- **Slugs válidos:** `consultas`, `talleres`, `grupos`, `procesos-integrativos`, `sesiones-holisticas`
- **ServiceCard `id`:** Debe coincidir con slug de ruta existente para que `href={/servicios/${id}}` funcione.
- **Evitar `any`:** En `ServiceCard` y `Link`, usar tipo explícito de rutas. Ejemplo: `type ServiceSlug = 'consultas' | 'talleres' | 'grupos' | 'procesos-integrativos' | 'sesiones-holisticas'`.

### Patrones a seguir

1. **Páginas de servicios:** Hero (gradiente o `bg-brand-primary`) → Grid de cards → CTA (Contactar, Ver Todos)
2. **Cards:** Usar `card-enhanced` y `font-subtitle` para títulos; paleta de marca (#AE0000, #F0EACE, #FFF4B3)
3. **Metadata:** Incluir `metadata` con `title` y `description` en todas las páginas de servicios
4. **Links internos:** Siempre verificar que la ruta exista antes de enlazar

### Anti-patrones a evitar

- **Links rotos:** No enlazar a `/servicios`, `/servicios/procesos`, `/servicios/retiros`, `/servicios/formaciones`, `/servicios/analisis`, `/servicios/rutinas` sin crear la página
- **Inconsistencia Header/Footer:** Si se añade ruta, actualizar Header (menú Procesos) y Footer (sección Servicios)
- **`as any` en href:** Tipar correctamente; ver `Docs/modules/06-servicios-holisticos/MODULE.md` sección 5.3
- **Homepage con `/procesos`:** Usar `/servicios/procesos-integrativos` y `/servicios/sesiones-holisticas`

---

## Arquitectura

### Estructura esperada de páginas /servicios/*

```
src/app/(marketing)/servicios/
├── page.tsx              # Landing hub (NO EXISTE; crear como prioridad alta)
├── consultas/page.tsx     # ✅
├── talleres/page.tsx     # ⚠️ Placeholder
├── grupos/page.tsx       # ⚠️ Placeholder
├── procesos-integrativos/page.tsx  # ✅
├── sesiones-holisticas/page.tsx    # ✅
├── procesos/             # NO EXISTE (Header lo referencia)
│   ├── page.tsx
│   ├── ciclos-alquimicos/page.tsx
│   └── sesiones-integrales/page.tsx
├── retiros/page.tsx      # NO EXISTE (Footer lo referencia)
└── formaciones/page.tsx  # NO EXISTE (Footer lo referencia)
```

### ServiceCard

- **Props:** `id`, `title`, `description`, `price`, `duration`, `category`, `imageUrl`, `rating`, `reviewCount`, `location`, `groupSize`, `features`, `onBookSession?`
- **Links:** `href` debe ser `/servicios/${id}` donde `id` es slug válido
- **Reserva:** `onBookSession(id)` se llama al hacer clic en "Reservar"; actualmente sin implementación backend

### Integración con Header, Footer, NavigationMenu

| Componente | Rutas de servicios |
|------------|-------------------|
| **Header** | Menú "Procesos": `/servicios/procesos`, `/servicios/procesos/ciclos-alquimicos`, `/servicios/procesos/sesiones-integrales` |
| **Footer** | Sección "Servicios": `/servicios/consultas`, `/servicios/grupos`, `/servicios/talleres`, `/servicios/retiros`, `/servicios/formaciones` |
| **NavigationMenu** (daLuzNavigationItems) | `/servicios`, `/servicios/analisis`, `/servicios/rutinas` |
| **Homepage** | Procesos Integrativos, Sesiones Holísticas, Membresía |

**Regla:** Antes de añadir un link, verificar que la página exista. Si no existe, crear la página o quitar el link.

---

## Mejores Prácticas

### Performance

- Usar `next/image` para imágenes en ServiceCard y páginas de servicios
- Evitar bundles pesados en páginas estáticas; el módulo es ligero

### Seguridad

- Si se implementan formularios de contacto/reserva: validar inputs (Zod), sanitizar, no exponer datos sensibles
- RLS en Supabase si se añaden tablas de servicios/reservas

### Mantenibilidad

- Componentes < 200 líneas; extraer secciones si se supera
- DRY: Reutilizar `ServiceCard` en lugar de cards inline cuando se liste servicios
- Single Responsibility: Una página, un tipo de servicio (consultas, talleres, etc.)

### Accesibilidad

- `alt` en imágenes de ServiceCard
- Contraste suficiente (brand-primary sobre fondos claros)
- Botones "Reservar" y "Más Info" con texto descriptivo

---

## Refactorización

### Cuándo refactorizar

- ServiceCard supera 200 líneas → Extraer subcomponentes (ServiceImage, ServiceFeatures, ServiceCTA)
- Múltiples páginas con hero similar → Extraer `ServicePageHero`
- Links desactualizados → Ejecutar búsqueda global de `/servicios`, `/procesos` y corregir

### Cómo refactorizar sin romper links

1. Crear nueva ruta antes de eliminar la antigua
2. Añadir redirect en `next.config.js` si se cambia slug: `redirects: [{ source: '/servicios/old', destination: '/servicios/new', permanent: true }]`
3. Actualizar Header, Footer, homepage y páginas de servicios en la misma PR

---

## Checklist Pre-Commit

- [ ] Todos los links `/servicios/*` apuntan a páginas existentes
- [ ] Header (desktop y mobile) y Footer tienen rutas coherentes
- [ ] ServiceCard: si se usa, `id` es slug válido; `href` tipado sin `any`
- [ ] Páginas nuevas tienen `metadata` (title, description)
- [ ] No se introducen 404 (verificar manualmente o con test)
- [ ] Componentes < 200 líneas
- [ ] Sin `console.log` de debug

---

## Referencias

- **Docs del módulo:** `Docs/modules/06-servicios-holisticos/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Sistema de diseño:** `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
