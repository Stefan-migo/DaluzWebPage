# Centro de Ayuda — Rediseño Premium y Refactor a CSS Module

**Fecha:** 2026-05-08
**Branch:** feat/admin-edit-orders (rediseño paralelo)
**Ruta afectada:** `src/app/(marketing)/ayuda/`

## Contexto

La página `/ayuda` (Centro de Ayuda de daluzconsciente.com) está construida en un único archivo `page.tsx` con clases utilitarias de Tailwind CSS mezcladas con la estructura del componente. La densidad de utilidades dificulta la lectura, el mantenimiento y la iteración visual.

El objetivo es separar responsabilidades en dos archivos hermanos y, simultáneamente, elevar la calidad visual a un estándar premium dentro del lenguaje "Místico Atmosférico" de la marca Da Luz Consciente.

## Objetivos

1. **Separación clara:** `page.tsx` contiene solo JSX semántico, datos y `motion`; `ayuda.module.css` contiene todos los estilos visuales en CSS puro moderno.
2. **Rediseño premium:** glassmorphism atmosférico, sombras tintadas elegantes, tipografía protagonista, sensación editorial de marca de wellness premium.
3. **Coherencia con el design system:** respetar paleta, tipografías, sistema unificado de botones (`border-radius: 0px 15px`, VELISTA uppercase).
4. **Sin regresión funcional:** todos los enlaces, animaciones y comportamientos actuales se preservan.

## No-objetivos (out of scope)

- Funcionalidad de búsqueda (descartada explícitamente).
- Formulario de contacto (los canales siguen siendo Email + WhatsApp por links externos).
- Cambios al backend o a las rutas.
- Refactor de componentes shadcn (`Button`).
- Modificar otras páginas del sitio.
- Tutoriales en video o guías descargables reales (siguen como "Próximamente").

## Decisiones de diseño (todas confirmadas con el usuario)

### Arquitectura técnica — Híbrido inteligente
- **Mantener:** `Button` de shadcn (variantes `alma`, `ecos`, `jade`, `umbral`, `brand-ghost`) → respeta el sistema unificado `btn-global` del resto del sitio.
- **Reemplazar:** `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`, `Badge` → elementos HTML nativos estilizados desde el módulo CSS.
- **Mantener:** íconos de `lucide-react`, `motion` de framer-motion, `Link` de next.

### Tono visual — Místico Atmosférico
- Cream `#FFF2DB` base, bordó `#791010` protagonista.
- Glassmorphism con `backdrop-filter: blur(16px)` sobre fondos translúcidos.
- Sombras tintadas en bordó (no negras puras).
- Textura de noise SVG sutil (4% opacity) sobre gradientes.
- Blobs orgánicos difusos (`filter: blur(80–120px)`) en lugar de círculos geométricos.
- Tipografía: VELISTA (títulos), Playfair Display (subtítulos), EB Garamond (body), Inter (caption/eyebrow).

### Hero — Refinamiento sutil (sin buscador, sin breadcrumb)
- Gradiente diagonal de 3 stops: `#791010` → `#9B201A` → `#791010`.
- Capa de noise SVG sutil al 4% de opacidad.
- Dos blobs orgánicos: uno highlight dorado, otro bordó claro, `blur(120px)`.
- Eyebrow: línea horizontal fina dorada + ícono `HelpCircle` pequeño + texto small caps "ESTAMOS AQUÍ PARA AYUDARTE" en Inter.
- Título VELISTA "Centro de Ayuda" — `clamp(2.5rem, 6vw, 5rem)`, peso normal, `letter-spacing: 0.05em`, color cream.
- Subtítulo Playfair Display italic en cream translúcido al 85%.
- Divisor decorativo: `· ─── ◆ ─── ·` en color highlight dorado `#F8D794`.
- Animación: fade-in + translateY desde abajo, escalonado por elemento (framer-motion stagger).

### Categorías de Ayuda — Glassmorphism atmosférico
- Grid 2x2 de cards (responsive: 1 columna en mobile).
- **Card:**
  - Fondo: `rgba(255,255,255,0.6)` con `backdrop-filter: blur(16px)`.
  - Borde: `1px solid rgba(255,255,255,0.4)`.
  - Acento lateral izquierdo de 4px en color de la línea (alma/ecos/jade/umbral).
  - Border radius: `0px 15px 0px 15px` (guiño al sistema de botones).
  - Sombra base: `0 8px 30px rgba(120,16,16,0.08)`.
- **Ícono:** círculo 64px con gradiente lightest→light de la línea + brillo interior.
- **Lista de items:** separador hairline (`border-bottom: 1px solid rgba(120,16,16,0.08)`).
- **Hover:** `translateY(-4px)`, sombra crece y se tinta del color de la línea, acento lateral se ensancha a 6px (CSS puro, no motion).
- **CTA:** Button shadcn con variant del color de la línea + ícono ArrowRight con animación translateX al hover.

### Recursos Populares — Hermanas reducidas
- Grid de 4 cards (responsive: 1 → 2 → 4 columnas).
- Mismo lenguaje glassmorphism que categorías pero a escala reducida:
  - Acento lateral 2px (vs. 4px).
  - Ícono 48px (vs. 64px).
  - Sin lista de items.
  - Layout vertical centrado: ícono → título → descripción corta → link "Ver más" con ChevronRight.
- Hover idéntico pero más sutil (`translateY(-2px)`).

### Quick Links Grid — Card destacada + dos en preview
- Grid de 3 cards con jerarquía explícita.
- **Card destacada (FAQ activa):** glassmorphism más marcado, sombra más fuerte, ícono 80px, CTA prominente con animación.
- **Cards "Próximamente" (Videos, Guías):** opacity 70%, glassmorphism más sutil, eyebrow label "PRÓXIMAMENTE" en dorado en esquina superior derecha, botón reemplazado por indicador estático "Disponible pronto" con ícono Clock.
- Comunica claramente: lo que está disponible vs. lo que viene.

### Contact Support — Cierre minimalista en cream (contraste deliberado)
- Fondo cream (NO bordó) — rompe el lenguaje atmosférico para que el cierre se sienta directo y accionable.
- Eyebrow + heading VELISTA bordó "¿No encontraste lo que buscabas?" + descripción.
- Dos cards Email/WhatsApp como tarjetas planas:
  - Borde fino bordó al 25% (1px).
  - Sin glassmorphism aquí.
  - Layout horizontal: ícono grande circular (gradiente del color) a la izquierda + contenido a la derecha (título + descripción + dato de contacto destacado en VELISTA + Button).
  - Hover: borde se vuelve sólido al 100%, sombra sutil aparece, `translateY(-2px)`.
- Footer del bloque: línea divisoria fina + ícono Clock + horario en Inter caption, todo bordó al 70%.

### Animaciones (framer-motion)
- Hero: `fade-in + translateY` con stagger entre eyebrow/título/subtítulo/divisor.
- Cada sección: `whileInView` con `viewport: { once: true }`.
- Grids: `staggerChildren: 0.1` en el container, `fade-in + translateY: 20px` en cada item.
- Hover de cards: CSS puro (más performante).
- Soporte `prefers-reduced-motion` → desactiva translateY en hover.

## Estructura del CSS Module

Nombres de clases en camelCase (convención de CSS Modules), agrupados por sección:

```
.page                       wrapper general

# Hero
.heroSection
.heroBackground             gradiente + capas
.heroNoise                  SVG textura
.heroBlob1, .heroBlob2      blobs orgánicos
.heroContent                contenedor centrado
.heroEyebrow                línea + small caps
.heroEyebrowLine
.heroEyebrowText
.heroTitle                  VELISTA grande
.heroSubtitle               Playfair italic
.heroDivider                · ─── ◆ ─── ·
.heroDividerLine
.heroDividerDot
.heroDividerDiamond

# Sección genérica
.section
.sectionInner
.sectionEyebrow
.sectionEyebrowIcon
.sectionHeading             VELISTA centrado
.sectionDescription         Playfair italic centrado
.sectionBlobs               capa decorativa de blobs

# Categorías
.categoriesGrid             grid 2x2
.categoryCard               card glassmorphism principal
.categoryCard[data-line]    variantes alma/ecos/jade/umbral
.categoryAccent             barra lateral 4px
.categoryHeader
.categoryIcon               círculo 64px gradiente
.categoryTitle              VELISTA
.categoryDescription        EB Garamond
.categoryList               lista con hairlines
.categoryListItem
.categoryItemDot            punto color línea
.categoryItemLink
.categoryCta                wrapper del Button shadcn

# Recursos
.resourcesGrid              grid 4 columnas
.resourceCard               glassmorphism reducida
.resourceCard[data-line]    variantes
.resourceAccent             barra lateral 2px
.resourceIcon               círculo 48px
.resourceTitle
.resourceDescription
.resourceLink

# Quick Links
.quickGrid                  grid 3 columnas
.quickCard                  base
.quickCardFeatured          modificador FAQ activa
.quickCardComing            modificador Próximamente
.quickEyebrowComing         label dorado esquina
.quickIcon
.quickTitle
.quickDescription
.quickAction
.quickComingAction          indicador "Disponible pronto"

# Contact
.contactSection             cierre minimalista cream
.contactInner
.contactGrid                2 columnas
.contactCard                card plana borde bordó
.contactCard[data-line]
.contactCardIcon            círculo gradiente
.contactCardBody
.contactCardTitle
.contactCardDescription
.contactCardData            email/teléfono en VELISTA
.contactCardCta
.contactFooter              divisor + horario
.contactFooterDivider
.contactFooterText
.contactFooterNote
```

## Responsive

- **Mobile (< 640px):** grids colapsan a 1 columna en todas las secciones; padding reducido; tipografía vía `clamp()`.
- **Tablet (640–1024px):** 2 columnas en categorías y recursos.
- **Desktop (> 1024px):** layouts completos (2x2, 4 cols, 3 cols, 2 cols).
- Tipografía con `clamp()` para fluidez sin breakpoints discretos.
- Padding de secciones con `clamp(4rem, 8vw, 8rem)` para respiración natural.

## Decisiones técnicas adicionales

- Variables CSS locales al módulo (`--brand-primary`, `--cream`, etc.) para evitar re-tipear hex.
- Mapeo `data-line="alma|ecos|jade|umbral"` en cards → permite resolver color de línea desde CSS sin clases dinámicas en JSX.
- `:global()` solo si es estrictamente necesario; preferir minimizar.
- Imports en `page.tsx`: solo lo necesario (eliminamos `Card`, `CardContent`, `CardTitle`, `CardDescription`, `Badge`; quedan: `Button`, íconos de lucide usados, `Link`, `motion`).
- Eliminar imports no usados (`ExternalLink` no se usaba en el actual; revisar).

## Estructura de datos

Los arrays `helpCategories`, `popularResources`, `contactMethods` se preservan en `page.tsx` con la misma forma. Solo se simplifica:
- Eliminar `bgColor`, `hoverColor` (ahora viven en CSS).
- Mantener `color` como discriminador (`alma|ecos|jade|umbral|brand`).
- Eliminar `colorVariants` (ahora resuelto vía `data-line` + CSS).

Se agrega un nuevo array para Quick Links (FAQ destacada + dos próximamente) o se inline en JSX si son solo 3 ítems.

## Testing manual (verification)

1. La página carga sin errores en build (`pnpm build` o `next build`).
2. Las animaciones disparan al scroll en cada sección.
3. Los hovers responden en cards (translate + sombra tintada + acento se ensancha).
4. Los enlaces funcionan (FAQ, políticas, mailto, wa.me).
5. Responsive: probar a 375px, 768px, 1280px.
6. La sección de contacto se ve sobre cream (no bordó).
7. Las cards de "Próximamente" se ven atenuadas con label dorado.
8. Tipografías cargan correctamente (VELISTA en títulos, Playfair en subtítulos, EB Garamond en body, Inter en eyebrow).

## Riesgos y mitigaciones

- **Riesgo:** las variantes `Button` de shadcn (`alma`, `ecos`, `jade`, `umbral`, `brand-ghost`) deben existir en `src/components/ui/button.tsx`. **Mitigación:** verificar antes de implementar; si alguna no existe, usar la variante existente más cercana.
- **Riesgo:** glassmorphism puede no verse bien sobre fondo cream sólido (necesita "algo" detrás para que el blur se note). **Mitigación:** los blobs decorativos en cada sección sirven justamente como capa de profundidad detrás de las cards.
- **Riesgo:** noise SVG inline puede agregar peso si es grande. **Mitigación:** usar un patrón pequeño (ej. 256x256) repetido vía `background-repeat`.

## Entregables

1. `src/app/(marketing)/ayuda/page.tsx` — refactorizado, con `import styles from './ayuda.module.css'`.
2. `src/app/(marketing)/ayuda/ayuda.module.css` — nuevo archivo con todos los estilos.
