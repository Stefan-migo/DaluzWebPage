# DOCUMENTO DE DISEÑO UX/UI

## Panel "Tesoros Da Luz" - Sistema de Contenido Exclusivo

---

## 1. INFORMACIÓN DEL PROYECTO

| Campo             | Valor                                            |
| ----------------- | ------------------------------------------------ |
| **Proyecto**      | Panel Tesoros Da Luz                             |
| **Tipo**          | Sistema de contenido exclusivo basado en compras |
| **Marca**         | Alkimya - Cosmético Natural Premium              |
| **Framework**     | Next.js 14.2.35 (App Router)                     |
| **Styling**       | Tailwind CSS 3.x, class-variance-authority       |
| **UI Components** | Radix UI primitives, Lucide icons                |
| **Animations**    | Framer Motion                                    |
| **Estado**        | Modo PLAN (no implementación)                    |
| **Fecha**         | 23 de Marzo 2026                                 |
| **Versión**       | 1.0                                              |

---

## 2. RESEARCH - Análisis de Contexto

### 2.1 Producto Actual

La página existente `/alkimya/tesoros-daluz` es una página informativa de marketing que describe:

- Qué son los Tesoros Da Luz
- Papel Semilla y siembre de intención
- Portal de Inmersión (Tesoro Universal + Tesoro Específico por línea)
- Plus de la Sinergia (para Kits)
- Cómo desbloquear

**Limitación detectada**: La página actual NO es un panel funcional de acceso a contenido. Es purely marketing/content sin diferenciación de acceso según compras del usuario.

### 2.2 Estructura de Contenido Objetivo

```
TESOROS DA LUZ
├── PORTAL DE BIENVENIDA (tesoro-gral)
│   ├── La Intención y el Biotipo (PDF)
│   ├── Anclaje de la Presencia (Audio)
│   └── Música Medicina (Link a Playlist)
│
├── 5 LÍNEAS DE PRODUCTO
│   ├── ECOS (Capilar)
│   │   ├── Audio Ritual
│   │   ├── Ejercicio voz
│   │   ├── Respiración cleanup
│   │   └── Intención
│   │
│   ├── UMBRAL (Cuerpo)
│   │   ├── Audio Ritual
│   │   ├── Ejercicio sacro
│   │   ├── Respiración abdominal
│   │   └── Intención
│   │
│   ├── PRISM.A/UTÓPICA (Maquillaje)
│   │   ├── Audio Ritual
│   │   ├── Ejercicio vista
│   │   ├── Respiración cuadrada
│   │   └── Intención
│   │
│   ├── JADE RITUAL (Tratamiento)
│   │   ├── Audio Ritual
│   │   ├── Sostener pecho/espalda
│   │   ├── Mudra corazón
│   │   └── Intención
│   │
│   └── ALMA TERRA (Aromaterapia)
│       ├── Audio Ritual
│       ├── 7/11 Mudras
│       ├── Respiración alternada
│       └── Intención
│
└── 11 KITS (cada uno con contenido superior)
    └── Contenido Kits + TODO lo de su línea
```

### 2.3 Tipos de Contenido

| Tipo                   | Formato      | Plataforma              |
| ---------------------- | ------------ | ----------------------- |
| Audio Ritual           | MP3          | Bunny.net / Host propio |
| Audios Complementarios | MP3          | Bunny.net / Host propio |
| Ejercicios             | Video        | Bunny.net               |
| PDFs                   | PDF          | Storage                 |
| Textos Enriquecidos    | MDX / HTML   | Base de datos           |
| Música                 | Link externo | Spotify / YouTube       |

### 2.4 User Roles

1. **Visitante sin cuenta**: Ve página de marketing, no accede a contenido
2. **Usuario registrado sin compras**: Ve página de marketing, quizás preview del portal
3. **Usuario con compras**: Accede a contenido según productos comprados
4. **Admin**: Gestiona contenido y asignaciones

---

## 3. DESIGN DIRECTION - Dirección Estética

### 3.1 Tipo de Producto

**Categoría**: Wellness/Beauty/Spa - Premium Content Membership
**Industria**: Cosmética natural consciente
**Tono**: Auténtico, premium, transformador, cálido

### 3.2 Mood & Tono

- **Autenticidad**: Conexión con naturaleza y lo artesanal
- **Premium**: Calidad superior, no masificación
- **Transformación**: Cambio positivo, bienestar holístico
- **Calidez**: Ambiente acogedor, cercano
- **Espiritualidad sutil**: Sin ser esotérico en exceso

### 3.3 Keywords de Diseño

```
premium wellness, natural cosmetics, ritualistic,
minimalist luxury, earth tones, warm neutrals,
soft gradients, organic shapes, mindful consumption,
sustainable beauty, artisanal quality
```

### 3.4 Estilo Visual Elegido

**Estilo**: Organic Minimalism + Warm Earth Tones

Este estilo combina:

- Minimalismo con espacios amplios y respirables
- Paleta cálida de tierra (terracota, arena, verde musgo)
- Formas orgánicas sutiles (no geométricas duras)
- Tipografía elegante con serif para títulos
- Texturas naturales sutiles

### 3.5 Anti-Patrones a Evitar

❌ NO usar fondos blancos puros
❌ NO usar colores corporativos genéricos (azul corporativo)
❌ NO diseñar como dashboard técnico (gridsdensos, tablas)
❌ NO usar iconografía genérica (iconos blandos, no outlined)
❌ NO animaciones excesivas o llamativas
❌ NO interfaces que parezcan "app de fitness"

---

## 4. DESIGN SYSTEM - Tokens de Diseño

### 4.1 Paleta de Colores por Sección

```css
/* ===========================
   PANEL TESOROS DA LUZ
   =========================== */

/* Fondo Principal - Crema cálido */
--tesoros-bg: #f6fbd6;
--tesoros-bg-secondary: #f0eace;
--tesoros-bg-elevated: #fffdf8;

/* Texto Principal - Bordó profundo */
--tesoros-text: #601010;
--tesoros-text-secondary: #791010;
--tesoros-text-muted: #9a5a5a;

/* Acentos */
--tesoros-accent: #c70000;
--tesoros-accent-hover: #ae0000;
--tesoros-highlight: #f8d794;

/* Borde/Divisores */
--tesoros-border: rgba(96, 16, 16, 0.15);
--tesoros-border-strong: rgba(96, 16, 16, 0.3);

/* Estados */
--tesoros-success: #286939;
--tesoros-warning: #f17e06;
--tesoros-error: #ae0000;
--tesoros-info: #12406f;

/* Overlay para modales/drawers */
--tesoros-overlay: rgba(96, 16, 16, 0.6);
```

### 4.2 Paletas por Línea de Producto (para Cards)

```css
/* ECOS - Azules (cuidado personal) */
--ecos-tesoros-primary: #12406f;
--ecos-tesoros-secondary: #005180;
--ecos-tesoros-accent: #0084ac;
--ecos-tesoros-light: #b7dfe5;
--ecos-tesoros-bg: linear-gradient(135deg, #b7dfe5 0%, #81ccd7 100%);

/* UMBRAL - Naranjas (energía) */
--umbral-tesoros-primary: #ea4f12;
--umbral-tesoros-secondary: #f17e06;
--umbral-tesoros-accent: #f49200;
--umbral-tesoros-light: #fff2db;
--umbral-tesoros-bg: linear-gradient(135deg, #fff2db 0%, #ffd18a 100%);

/* PRISM.A/UTÓPICA - Dorados (lujo) */
--utopica-tesoros-primary: #392e13;
--utopica-tesoros-secondary: #72571c;
--utopica-tesoros-accent: #d2a00c;
--utopica-tesoros-light: #f9f5c5;
--utopica-tesoros-bg: linear-gradient(135deg, #f9f5c5 0%, #f8ee76 100%);

/* JADE RITUAL - Verdes (bienestar) */
--jade-tesoros-primary: #04412d;
--jade-tesoros-secondary: #286939;
--jade-tesoros-accent: #0c9e5d;
--jade-tesoros-light: #d3e1be;
--jade-tesoros-bg: linear-gradient(135deg, #d3e1be 0%, #7bc38e 100%);

/* ALMA TERRA - Rojos/Terracota (cosmética) */
--alma-tesoros-primary: #9b201a;
--alma-tesoros-secondary: #bd311c;
--alma-tesoros-accent: #df4e21;
--alma-tesoros-light: #ffefc6;
--alma-tesoros-bg: linear-gradient(135deg, #ffefc6 0%, #ffe58d 100%);
```

### 4.3 Tipografía

**Sistema de Fuentes (ya definido en globals.css - NO MODIFICAR)**

| Rol             | Fuente                | Uso                       |
| --------------- | --------------------- | ------------------------- |
| `font-display`  | Malisha (custom)      | Logo, hero displays       |
| `font-title`    | VELISTA (custom)      | Page/section titles, h1   |
| `font-subtitle` | Playfair Display      | Subtítulos, h2-h4, italic |
| `font-text`     | EB Garamond (oficial) | Body text, min 18px       |
| `font-caption`  | Inter                 | UI labels, captions       |

**Escala Tipográfica para Panel Tesoros**

```
text-xs:   0.75rem  (12px)  - Badges, metadata
text-sm:   0.875rem (14px)  - Secondary text, captions
text-base: 1rem     (16px)  - Small labels
text-lg:   1.125rem (18px)  - Body text principal
text-xl:   1.25rem  (20px)  - Subtitles
text-2xl:  1.5rem   (24px)  - Section headings
text-3xl:  1.875rem (30px)  - Page titles
```

**Reglas Tipográficas del Cliente (CRÍTICO)**

⚠️ **PROHIBIDO**:

- NO usar Malisha para texto largo de párrafos
- NO usar #000000 ni #333333 para texto de cuerpo
- NO usar tamaños arbitrarios

✅ **OBLIGATORIO**:

- Títulos: centrados, uppercase para h1
- Body: mínimo 18px, line-height 1.5-1.6
- Botones: 0.875rem (14px) FIJO, uppercase, letter-spacing 1px
- Subtítulos: Playfair Display Bold Italic

### 4.4 Espaciado (4pt/8pt Grid)

```css
/* Espaciado base - Mobile */
--tesoros-space-1: 0.25rem; /* 4px */
--tesoros-space-2: 0.5rem; /* 8px */
--tesoros-space-3: 0.75rem; /* 12px */
--tesoros-space-4: 1rem; /* 16px */
--tesoros-space-5: 1.25rem; /* 20px */
--tesoros-space-6: 1.5rem; /* 24px */
--tesoros-space-8: 2rem; /* 32px */
--tesoros-space-10: 2.5rem; /* 40px */
--tesoros-space-12: 3rem; /* 48px */
--tesoros-space-16: 4rem; /* 64px */

/* Secciones */
--tesoros-section-gap: var(--tesoros-space-12); /* 48px entre secciones */
--tesoros-card-gap: var(--tesoros-space-4); /* 16px entre cards */
--tesoros-inner-padding: var(--tesoros-space-6); /* 24px padding interno */
```

### 4.5 Sombras y Elevación

```css
/* Sombras del sistema - Alkimya */
--shadow-soft: 0 2px 8px rgba(96, 16, 16, 0.08);
--shadow-medium: 0 4px 16px rgba(96, 16, 16, 0.12);
--shadow-alkimya: 0 4px 20px rgba(174, 0, 0, 0.15);
--shadow-alkimya-lg: 0 8px 30px rgba(174, 0, 0, 0.2);
--shadow-alkimya-xl: 0 12px 40px rgba(174, 0, 0, 0.25);

/* Elevación por componente */
--tesoros-card-shadow: var(--shadow-soft);
--tesoros-card-hover-shadow: var(--shadow-medium);
--tesoros-modal-shadow: var(--shadow-alkimya-lg);
--tesoros-drawer-shadow: 8px 0 30px rgba(96, 16, 16, 0.2);
```

### 4.6 Border Radius

```css
/* Radio de borde por componente */
--tesoros-radius-sm: 0.5rem; /* 8px - badges */
--tesoros-radius-md: 0.75rem; /* 12px - inputs */
--tesoros-radius-lg: 1rem; /* 16px - cards pequeñas */
--tesoros-radius-xl: 1.25rem; /* 20px - cards grandes */
--tesoros-radius-2xl: 1.5rem; /* 24px - modales */
--tesoros-radius-full: 9999px; /* pill - botones */

/* Excepción actual del cliente: 0 15px (botón global) */
--tesoros-btn-radius: 0 15px;
```

### 4.7 Transiciones y Animaciones

```css
/* Duración */
--tesoros-duration-fast: 150ms;
--tesoros-duration-normal: 250ms;
--tesoros-duration-slow: 400ms;

/* Easing */
--tesoros-ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--tesoros-ease-in: cubic-bezier(0.4, 0, 1, 1);
--tesoros-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Animaciones específicas */
--tesoros-transition-default: all var(--tesoros-duration-normal)
  var(--tesoros-ease-out);
--tesoros-transition-colors:
  background-color, border-color,
  color var(--tesoros-duration-fast) var(--tesoros-ease-out);
--tesoros-transition-transform: transform var(--tesoros-duration-normal)
  var(--tesoros-ease-out);
```

### 4.8 Z-Index Scale

```css
--tesoros-z-base: 0;
--tesoros-z-dropdown: 100;
--tesoros-z-sticky: 200;
--tesoros-z-overlay: 300;
--tesoros-z-modal: 400;
--tesoros-z-popover: 500;
--tesoros-z-toast: 600;
--tesoros-z-tooltip: 700;
```

---

## 5. WIREFRAME/BLUEPRINT - Estructura de la Página

### 5.1 Arquitectura de Página

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (Sticky)                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Logo │ Navegación Principal │ Usuario/Búsqueda          │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  TÍTULO DE SECCIÓN                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           "MIS TESOROS DA LUZ" (font-title, uppercase)   │   │
│  │                  Bienvenida personalizada                  │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  NAVEGACIÓN DE TESOROS (Tabs horizontales)                      │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┐                      │
│  │GRAL │ECOS │UMBRAL│JADE │ALMA │KITS │  (Scroll horizontal)  │
│  └─────┴─────┴─────┴─────┴─────┴─────┘                      │
├─────────────────────────────────────────────────────────────────┤
│  CONTENIDO PRINCIPAL                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │ CONTENIDO│  │ CONTENIDO│  │ CONTENIDO│             │   │
│  │  │   CARD   │  │   CARD   │  │   CARD   │             │   │
│  │  │          │  │          │  │          │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │ CONTENIDO│  │ CONTENIDO│  │ CONTENIDO│             │   │
│  │  │   CARD   │  │   CARD   │  │   CARD   │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER (minimal)                                               │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Layouts por Breakpoint

**Mobile (< 768px)**: Stack vertical, tabs horizontales scrolleables, cards 1 columna

**Tablet (768px - 1023px)**: Grid 2 columnas, tabs visibles completos

**Desktop (≥ 1024px)**: Grid 3 columnas, sidebar opcional para navegación

### 5.3 Variante: Empty State (Sin compras)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
├─────────────────────────────────────────────────────────────────┤
│  ILUSTRACIÓN (icono o SVG de tesoro/llave)                      │
│                                                                 │
│  "Aún no tienes Tesoros"                                        │
│                                                                 │
│  " Cuando realices tu primera compra,                             │
│    aquí aparecerán tus tesoros."                                 │
│                                                                 │
│  [ EXPLORAR LA TIENDA ] → Button primario                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Variante: Loading State

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
├─────────────────────────────────────────────────────────────────┤
│  SKELETON LOADER                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │                      │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │                      │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│  ... (6-9 skeleton cards)                                       │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. COMPONENT INVENTORY - Inventario de Componentes

### 6.1 Navigation Components

#### 6.1.1 TesorosHeader

**Descripción**: Header sticky con logo y navegación de usuario

| Estado   | Descripción Visual                                       |
| -------- | -------------------------------------------------------- |
| Default  | Logo a la izquierda, navegación centrada, avatar derecha |
| Scrolled | Sombra suave aparece, background se vuelve sólido        |
| Mobile   | Hamburger menu, logo centrado                            |

```typescript
interface TesorosHeaderProps {
  userName?: string;
  userAvatar?: string;
  onMenuToggle?: () => void;
}
```

#### 6.1.2 TesorosTabs

**Descripción**: Navegación horizontal por categorías de tesoro

| Estado   | Descripción Visual                                    |
| -------- | ----------------------------------------------------- |
| Default  | Tabs horizontales, línea inferior sutil               |
| Active   | Tab activo con color de línea de producto, texto bold |
| Hover    | Background sutil, transición 150ms                    |
| Disabled | Opacity 0.5, cursor not-allowed                       |
| Scroll   | Scroll horizontal con fade edges en mobile            |

```typescript
type TabId = "gral" | "ecos" | "umbral" | "jade" | "alma" | "kits";

interface TabItem {
  id: TabId;
  label: string;
  icon?: LucideIcon;
  color?: string; // Línea color
  locked?: boolean;
}

interface TesorosTabsProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}
```

### 6.2 Content Components

#### 6.2.1 TesorosCard

**Descripción**: Card principal para mostrar contenido (audio, video, PDF, texto)

| Estado         | Descripción Visual                                     |
| -------------- | ------------------------------------------------------ |
| Default        | Card con sombra suave, contenido centrado              |
| Hover          | Elevación aumenta, escala 1.02, sombra más pronunciada |
| Active/Playing | Borde con color de línea, badge "Reproduciendo"        |
| Locked         | Overlay oscuro con candado, opacity 0.7                |
| Loading        | Skeleton con shimmer                                   |

```typescript
type ContentType = "audio" | "video" | "pdf" | "text" | "link";

interface TesorosCardProps {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  thumbnailUrl?: string;
  duration?: string; // "5:30" para audio/video
  isLocked?: boolean;
  isNew?: boolean;
  lineColor?: "ecos" | "umbral" | "jade" | "alma" | "utopica";
  onPlay?: (id: string) => void;
  onClick?: (id: string) => void;
}
```

#### 6.2.2 ContentPlayer

**Descripción**: Modal o inline player para audio/video

| Estado  | Descripción Visual                      |
| ------- | --------------------------------------- |
| Closed  | No visible                              |
| Opening | Fade in 250ms + scale from 0.95         |
| Open    | Modal centrado, overlay oscuro          |
| Playing | Progress bar animado, controls visibles |
| Paused  | Play button prominente                  |
| Loading | Spinner centrado                        |
| Error   | Mensaje de error con retry              |

```typescript
interface ContentPlayerProps {
  isOpen: boolean;
  content: {
    type: "audio" | "video";
    url: string;
    title: string;
  };
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}
```

#### 6.2.3 PdfViewer

**Descripción**: Visor de PDF inline o modal

| Estado      | Descripción Visual                        |
| ----------- | ----------------------------------------- |
| Closed      | No visible                                |
| Loading     | Skeleton + spinner                        |
| Ready       | PDF renderizado con toolbar               |
| Error       | Mensaje de error con descarga alternativa |
| Downloading | Progress bar                              |

#### 6.2.4 RichTextBlock

**Descripción**: Texto enriquecido del tesoro

| Estado         | Descripción Visual                                |
| -------------- | ------------------------------------------------- |
| Default        | Texto con tipografía correcta, espaciado generoso |
| WithMeditation | Tipografía más grande, fondo diferenciado         |

### 6.3 Feedback Components

#### 6.3.1 EmptyState

**Descripción**: Estado cuando no hay contenido disponible

```typescript
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

#### 6.3.2 LoadingSkeleton

**Descripción**: Placeholder mientras carga contenido

| Variante | Uso             |
| -------- | --------------- |
| `card`   | Card completa   |
| `text`   | Líneas de texto |
| `avatar` | Avatar circular |
| `chart`  | Área de gráfico |

#### 6.3.3 Toast/Notification

**Descripción**: Feedback breve de acciones

| Variante  | Uso               |
| --------- | ----------------- |
| `success` | Acción completada |
| `error`   | Error con retry   |
| `info`    | Información       |
| `warning` | Advertencia       |

### 6.4 Access Components

#### 6.4.1 LockedOverlay

**Descripción**: Overlay para contenido bloqueado

| Estado | Descripción Visual                               |
| ------ | ------------------------------------------------ |
| Locked | Overlay semi-transparente, candado centrado, CTA |
| Teaser | Preview parcial con blur, "Desbloquea con..."    |

#### 6.4.2 UnlockPrompt

**Descripción**: Modal para desbloquear contenido

```typescript
interface UnlockPromptProps {
  productName: string;
  productImage?: string;
  unlockMethod: "compra" | "validacion";
  onClose: () => void;
  onAction: () => void;
}
```

---

## 7. USER FLOW - Flujo de Usuario

### 7.1 Flow Principal: Acceso a Contenido

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. LOGIN/REGISTRO                                              │
│     - Usuario llega desde email de confirmación de compra       │
│     - O desde "Mi Cuenta" → "Mis Tesoros"                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. VERIFICACIÓN DE ACCESO                                      │
│     Sistema verifica:                                            │
│     - Productos comprados por usuario                            │
│     - Tesoros asociados a cada producto                          │
│     - Estado de validación (si aplica)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │ SIN ACCESO        │  │ CON ACCESO       │
         │ (No hay compras)  │  │ (Usuario tiene   │
         │                   │  │  productos)      │
         └────────┬─────────┘  └────────┬─────────┘
                  │                      │
                  ▼                      ▼
         ┌──────────────────┐  ┌──────────────────────────────┐
         │ EMPTY STATE      │  │ PANEL TESOROS               │
         │ - Ilustración    │  │ - Header con tabs            │
         │ - CTA Tienda     │  │ - Grid de cards              │
         └──────────────────┘  │ - Contenido desbloqueado     │
                                └──────────────────────────────┘
                                                      │
                                          ┌───────────┴───────────┐
                                          ▼                       ▼
                               ┌──────────────────┐    ┌──────────────────┐
                               │ CLICK EN CARD   │    │ CARD BLOQUEADA   │
                               │                 │    │                  │
                               │ - Audio/Video:  │    │ - Mostrar preview│
                               │   Abre Player   │    │ - Overlay lock   │
                               │ - PDF: Abre    │    │ - CTA compra     │
                               │   Viewer       │    └──────────────────┘
                               │ - Texto: Scroll│
                               └──────────────────┘
```

### 7.2 Flow: Reproducción de Audio

```
┌─────────────────────────────────────────────────────────────────┐
│  USUARIO HACE CLICK EN CARD DE AUDIO                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SELECCIÓN DE CONTENIDO                                         │
│  - Identificar tipo (audio/video)                               │
│  - Verificar URL disponible                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ABRIR PLAYER                                                   │
│  - Modal con overlay                                            │
│  - Cargar medio                                                 │
│  - Mostrar controls                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │ PLAY              │  │ ERROR             │
         │                   │  │                  │
         │ - Progress bar    │  │ - Mensaje retry  │
         │ - Play/Pause      │  │ - Fallback URL    │
         │ - Volumen         │  └──────────────────┘
         │ - Velocidad       │
         └──────────────────┘
```

### 7.3 Flow: Validación de Compra Externa

```
┌─────────────────────────────────────────────────────────────────┐
│  USUARIO COMPRÓ EN LOCAL/WHATSAPP                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. REGISTRO EN WEB                                             │
│     - Crear cuenta o login                                       │
│     - Ir a "Validar Compra"                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. FORMULARIO DE VALIDACIÓN                                    │
│     - Email de compra                                           │
│     - Foto del producto / número lote / palabra clave            │
│     - Subir evidencia                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. REVISIÓN ADMIN                                              │
│     - Admin recibe notificación                                 │
│     - Valida compra                                             │
│     - Aprueba acceso                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. ACCESO CONCEDIDO                                            │
│     - Usuario recibe email                                       │
│     - Contenido aparece en panel                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. INFORMATION ARCHITECTURE - Arquitectura de Información

### 8.1 Estructura de Navegación

```
MIS TESOROS
├── PORTAL DE BIENVENIDA (tesoro-gral)
│   ├── PDF: La Intención y el Biotipo
│   ├── Audio: Anclaje de la Presencia
│   └── Link: Música Medicina
│
├── ECOS
│   ├── Audio Ritual
│   ├── Ejercicio de Voz
│   ├── Respiración Cleanup
│   └── Intención
│
├── UMBRAL
│   ├── Audio Ritual
│   ├── Ejercicio Sacro
│   ├── Respiración Abdominal
│   └── Intención
│
├── PRISM.A / UTÓPICA
│   ├── Audio Ritual
│   ├── Ejercicio de Vista
│   ├── Respiración Cuadrada
│   └── Intención
│
├── JADE RITUAL
│   ├── Audio Ritual
│   ├── Sostén de Pecho/Espalda
│   ├── Mudra del Corazón
│   └── Intención
│
├── ALMA TERRA
│   ├── Audio Ritual
│   ├── 7/11 Mudras
│   ├── Respiración Alternada
│   └── Intención
│
└── KITS (agrupados)
    ├── Kit 1
    ├── Kit 2
    └── ... (11 kits)
```

### 8.2 Jerarquía de Contenido

```
NIVEL 1: PORTAL (Mis Tesoros)
    │
    ├── NIVEL 2: CATEGORÍA (Línea de producto)
    │       │
    │       └── NIVEL 3: TIPO DE CONTENIDO
    │               │
    │               ├── Audio Ritual (♫)
    │               ├── Ejercicio (🎬)
    │               ├── Respiración (🌬️)
    │               └── Intención (✨)
    │
    └── NIVEL 2: KITS (agrupación especial)
            │
            └── NIVEL 3: KIT INDIVIDUAL
                    │
                    └── NIVEL 4: CONTENIDO (incluye todo de la línea + extra)
```

### 8.3 Patrón de Navegación Elegido

**Opción elegida**: Horizontal Tabs + Vertical Scroll

**Justificación**:

- Mobile-first: Tabs horizontales son naturales en móvil
- Las 5 líneas + kits es un número manejable de tabs
- Cada tab tiene suficiente contenido para scroll vertical
- No requiere sidebar (ahorra espacio)
- Drawer para detalles adicionales si necesario

**Alternativas descartadas**:

- ❌ Sidebar: Ocupa demasiado espacio en mobile
- ❌ Drawer: Requiere navegación adicional
- ❌ Dropdown: Menos visible, más clicks
- ❌ Cards grandes: Scroll infinito agotador

---

## 9. ACCESSIBILITY - Consideraciones de Accesibilidad

### 9.1 Color y Contraste

| Elemento         | Color   | Contraste | Cumplimiento |
| ---------------- | ------- | --------- | ------------ |
| Texto principal  | #601010 | 7.2:1     | ✅ AAA       |
| Texto secundario | #791010 | 5.8:1     | ✅ AA        |
| Texto en cards   | #ffffff | 12:1      | ✅ AAA       |
| Link/Botón       | #ae0000 | 4.6:1     | ✅ AA        |

### 9.2 Touch Targets

```css
/* Mínimo touch target: 44x44px (iOS) / 48x48dp (Android) */
--touch-target-min: 44px;

/* Botones y elementos interactivos */
.tesoros-touch-target {
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
}

/* Espaciado entre targets */
.tesoros-touch-gap {
  gap: var(--tesoros-space-2); /* 8px mínimo */
}
```

### 9.3 Navegación por Teclado

| Elemento        | Tab Index | Enter/Space    | Escape        |
| --------------- | --------- | -------------- | ------------- |
| Tabs            | ✅        | Activa tab     | -             |
| Cards           | ✅        | Abre contenido | Cierra modal  |
| Player controls | ✅        | Toggle         | Cierra player |
| Modal overlay   | ✅        | -              | Cierra modal  |
| Botones         | ✅        | Click          | -             |

### 9.4 Screen Readers

```typescript
// Estructura semántica
<main role="main">
  <nav aria-label="Navegación de tesoros">
    <button aria-selected="true" aria-label="Ecos - actual">
  </nav>
  <section aria-label="Contenido de Ecos">
    <article aria-labelledby="audio-ritual-title">
  </section>
</main>

// Videos y audios
<video aria-label="...">
  <track kind="captions" label="Español" />
</video>

// Estados
<button aria-pressed="false">Reproducir</button>
<button aria-expanded="false" aria-controls="panel-contenido">
```

### 9.5 Motion y Reducción

```css
/* Respetar prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .tesoros-animate-fade,
  .tesoros-animate-slide,
  .tesoros-animate-scale,
  .tesoros-player-progress {
    animation: none;
    transition: none;
  }
}
```

---

## 10. RESPONSIVE STRATEGY - Estrategia Responsive

### 10.1 Breakpoints

```css
/* Mobile First */
/* sm: 640px   - Large phones */
/* md: 768px   - Tablets portrait */
/* lg: 1024px  - Tablets landscape / Small laptops */
/* xl: 1280px  - Desktops */
/* 2xl: 1536px - Large desktops */
```

### 10.2 Grid System

| Breakpoint | Columns | Gap  | Card Width |
| ---------- | ------- | ---- | ---------- |
| < 640px    | 1       | 16px | 100%       |
| 640px      | 2       | 16px | ~50%       |
| 768px      | 2       | 20px | ~50%       |
| 1024px     | 3       | 24px | ~33%       |
| 1280px     | 3       | 24px | ~33%       |

### 10.3 Layout Behavior por Dispositivo

**Mobile (< 768px)**:

- Header: Logo centrado, hamburger, cuenta
- Tabs: Horizontal scroll, icons + labels
- Cards: 1 columna, altura variable
- Player: Fullscreen modal
- PDF: Fullscreen viewer

**Tablet (768px - 1023px)**:

- Header: Logo izquierda, tabs centro, cuenta derecha
- Tabs: Visibles completos
- Cards: 2 columnas
- Player: Modal centrado 80%
- PDF: Modal con sidebar índice

**Desktop (≥ 1024px)**:

- Header: Logo + navegación completa + usuario
- Tabs:inline con más detalles
- Cards: 3 columnas, altura fija
- Player: Modal centrado 60%, sidebar de playlist
- PDF: Modal con índice clickeable

### 10.4 Safe Areas

```css
/* iOS safe areas */
.tesoros-container {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Contenido no quedar detrás de header fijo */
.tesoros-main-content {
  padding-top: calc(64px + env(safe-area-inset-top));
}
```

---

## 11. TECHNICAL APPROACH - Enfoque Técnico

### 11.1 Estructura de Archivos Sugerida

```
src/
├── app/
│   └── (account)/
│       └── tesoros/
│           └── page.tsx           # Página principal
├── components/
│   └── tesoros/
│       ├── TesorosHeader.tsx
│       ├── TesorosTabs.tsx
│       ├── TesorosCard.tsx
│       ├── TesorosGrid.tsx
│       ├── ContentPlayer.tsx
│       ├── PdfViewer.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       ├── LockedOverlay.tsx
│       └── index.ts
├── hooks/
│   ├── useTesoros.ts              # Fetch y estado de tesoros
│   ├── useContentPlayer.ts       # Control del player
│   └── useAuth.ts                # Auth state
├── lib/
│   ├── tesoros/
│   │   ├── types.ts              # Tipos TypeScript
│   │   ├── constants.ts           # Configuración
│   │   └── utils.ts               # Utilidades
│   └── api/
│       └── tesoro-service.ts      # API calls
└── styles/
    └── tesoros.css               # Estilos específicos
```

### 11.2 Tipos TypeScript

```typescript
// types.ts

export type ContentType = "audio" | "video" | "pdf" | "text" | "link";

export type LineType = "gral" | "ecos" | "umbral" | "jade" | "alma" | "utopica";

export interface TesoroContent {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  url?: string;
  thumbnailUrl?: string;
  duration?: string;
  lineType: LineType;
  order: number;
  productId?: string; // Si es específico de un producto
  isNew?: boolean;
}

export interface TesoroAccess {
  userId: string;
  productId: string;
  tesoroId: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface UserTesoros {
  userId: string;
  accessedTesoros: string[];
  unlockedProducts: string[];
}
```

### 11.3 Estado de Componentes

```typescript
// useTesoros hook state
interface TesorosState {
  // Data
  tesoros: TesoroContent[];
  userAccess: string[]; // IDs de tesoros accesibles

  // UI State
  activeTab: LineType;
  isLoading: boolean;
  error: string | null;

  // Player State
  isPlayerOpen: boolean;
  currentContent: TesoroContent | null;

  // Pagination/Filtering
  page: number;
  hasMore: boolean;
}
```

---

## 12. NEXT STEPS - Próximos Pasos

### Fase 1: Validación (YA)

- [x] Documento de diseño completado
- [ ] Revisión con stakeholder
- [ ] Aprobación de tokens de diseño
- [ ]确认内容架构

### Fase 2: Planificación de Implementación

- [ ] Crear estructura de carpetas
- [ ] Definir API endpoints
- [ ] Diseñar schema de base de datos
- [ ] Plan de migración de contenido existente

### Fase 3: Implementación

- [ ] Componentes base (Header, Tabs, Grid)
- [ ] Sistema de autenticación y acceso
- [ ] Componentes de contenido (Cards, Player, PDF)
- [ ] Estados (Empty, Loading, Error)
- [ ] Responsive y mobile

### Fase 4: Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit

### Fase 5: Deploy

- [ ] Staging deployment
- [ ] QA验收
- [ ] Production deployment
- [ ] Monitorización

---

## 13. APPENDIX - Referencias

### A. Tokens CSS Completos

```css
/* ===========================
   TESOROS DA LUZ - CSS TOKENS
   =========================== */

.tesoros-tokens {
  /* Colors */
  --tesoros-bg: #f6fbd6;
  --tesoros-bg-secondary: #f0eace;
  --tesoros-bg-elevated: #fffdf8;
  --tesoros-text: #601010;
  --tesoros-text-secondary: #791010;
  --tesoros-text-muted: #9a5a5a;
  --tesoros-accent: #c70000;
  --tesoros-accent-hover: #ae0000;

  /* Spacing */
  --tesoros-space-1: 0.25rem;
  --tesoros-space-2: 0.5rem;
  --tesoros-space-4: 1rem;
  --tesoros-space-6: 1.5rem;
  --tesoros-space-8: 2rem;
  --tesoros-space-12: 3rem;

  /* Radius */
  --tesoros-radius-sm: 0.5rem;
  --tesoros-radius-md: 0.75rem;
  --tesoros-radius-lg: 1rem;
  --tesoros-radius-xl: 1.25rem;
  --tesoros-btn-radius: 0 15px;

  /* Shadows */
  --tesoros-shadow-soft: 0 2px 8px rgba(96, 16, 16, 0.08);
  --tesoros-shadow-medium: 0 4px 16px rgba(96, 16, 16, 0.12);
  --tesoros-shadow-alkimya: 0 4px 20px rgba(174, 0, 0, 0.15);

  /* Transitions */
  --tesoros-duration-fast: 150ms;
  --tesoros-duration-normal: 250ms;
  --tesoros-ease-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Z-index */
  --tesoros-z-base: 0;
  --tesoros-z-sticky: 200;
  --tesoros-z-overlay: 300;
  --tesoros-z-modal: 400;
}
```

### B. Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)

### C. Glosario

| Término | Definición                                      |
| ------- | ----------------------------------------------- |
| Tesoro  | Contenido digital exclusivo (audio, video, PDF) |
| Línea   | Cada una de las 5 líneas de producto Alkimya    |
| Kit     | Paquete de productos con contenido adicional    |
| Portal  | Sección de bienvenida con contenido general     |
| Locked  | Contenido no accesible para el usuario          |
| Unlock  | Acción de desbloquear contenido                 |

---

_Documento generado: 23 de Marzo 2026_
_Versión: 1.0_
_Estado: Para revisión_
