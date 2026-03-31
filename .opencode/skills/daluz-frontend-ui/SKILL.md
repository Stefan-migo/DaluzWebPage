---
name: daluz-frontend-ui
description: Guía para el módulo Frontend/UI de DA LUZ. Usar al modificar design system, tipografía, paleta, componentes (ui/, ui/brand/), animaciones (BlurText), Header, Footer, globals.css, tailwind.config, ThemeContext, variantes de Button/Card, accesibilidad UI o cualquier elemento visual.
---

# Frontend / UI - Guía de Desarrollo

## Alcance

Sistema de diseño, componentes base y brand, tipografía, paleta, animaciones, theming. **No incluye lógica de negocio** de módulos específicos (ecommerce, checkout, etc.), pero sí la presentación visual.

---

# ESPECIFICACIONES DE DISEÑO Y ESTILOS GLOBALES

## 1. PALETA DE COLORES

### Colores por Sección/Clase

| Clase              | Colores Principales             | Fondo              | Texto            |
| ------------------ | ------------------------------- | ------------------ | ---------------- |
| **.Raices y Blog** | `#051341` (azul)                | `#FFFFFF` (blanco) | `#FFFFFF`        |
| **.Procesos**      | verde oscuro + beige            | `#FFF2DB` (beige)  | según contraste  |
| **.Membresía**     | (usar paleta general)           | -                  | -                |
| **.Alkimya**       | `#7A160E`, `#285D30`, `#FF4E21` | -                  | `#791010` (rojo) |
| **.Tienda**        | `#7A160E`, `#285D30`, `#FF4E21` | -                  | `#791010` (rojo) |

### Paleta General

| Uso                   | Color              | HEX           |
| --------------------- | ------------------ | ------------- |
| Brand Primary (bordó) | Rojo bordó         | `#AE0000`     |
| Brand Secondary       | Rojo               | `#C70000`     |
| Accent                | Naranja-rojo       | `#DB3600`     |
| Warning               | -                  | `#FE1F02`     |
| Highlight (dorado)    | -                  | `#F8D794`     |
| Background Light      | Crema verdoso      | `#F0EACE`     |
| Background Lighter    | -                  | `#FFF4B3`     |
| Background Cream      | -                  | `#F6FBD6`     |
| **Texto Principal**   | **Bordó Profundo** | **`#601010`** |
| Texto en fondos beige | Beige claro        | `#FFF4E0`     |
| Texto Inverso         | Blanco             | `#FFFFFF`     |

### Líneas de Producto (Cosmética Natural)

| Línea                       | Primary   | Secondary | Accent    | Light     | Lightest  |
| --------------------------- | --------- | --------- | --------- | --------- | --------- |
| **Alma Terra** (cosmética)  | `#9B201A` | `#BD311C` | `#DF4E21` | `#FFE58D` | `#FFEFCC` |
| **Ecos** (cuidado personal) | `#12406F` | `#005180` | `#0084AC` | `#81CCD7` | `#B7DFE5` |
| **Jade Ritual** (bienestar) | `#04412D` | `#286939` | `#0C9E5D` | `#7BC38E` | `#D3E1BE` |
| **Umbral** (energía)        | `#EA4F12` | `#F17E06` | `#F49200` | `#FFD18A` | `#FFF2DB` |
| **Utópica** (lujo natural)  | `#392E13` | `#72571C` | `#D2A00C` | `#F8EE76` | `#F9F5C5` |

### Reglas de Color de Texto

> **IMPORTANTE:**
>
> - EN FONDOS BEIGE: texto `#791010` (rojo)
> - EN FONDOS DE COLOR: texto `#FFF4E0` (beige claro)
> - **ELIMINAR** uso de `#000000`, `#333333` y grises genéricos en cuerpos de texto

---

## 2. JERARQUÍA TIPOGRÁFICA (CSS Global)

### A. TÍTULOS PRINCIPALES (H1 y H2)

- **Fuente:** **VELISTA**
- **Uso:** Encabezados de secciones y títulos destacados
- **Transformación:** Mayúsculas (uppercase)
- **Alineación:** Centrado

### B. SUBTÍTULOS (H3 y Destacados)

- **Fuente:** **Playfair Display** (Peso: Medium o Semi-Bold)
- **Estilo:** Italic (cursiva)
- **Alineación:** Centrado cuando es título de sección

### C. CUERPO DE TEXTO / PÁRRAFOS (Body Text)

- **Fuente:** **EB Garamond** (mediano, 500 weight)
- **Tamaño mínimo:** 18px
- **Line-height:** 1.5 o 1.6
- **Reemplazar** cualquier bloque de texto largo que actualmente use Malisha por EB Garamond

### D. LABELS Y CAPTIONS

- **Fuente:** **Inter**
- **Uso:** UI small text, labels, captions

### Tabla Resumen de Tipografía

| Elemento        | Variable CSS    | Fuente             | Notas                             |
| --------------- | --------------- | ------------------ | --------------------------------- |
| Logo, Hero      | `font-display`  | Malisha            | Solo uso decorativo, NO body text |
| H1, H2          | `font-title`    | VELISTA            | Uppercase, centrado               |
| H3, Subtítulos  | `font-subtitle` | Playfair Display   | Italic, bold                      |
| Párrafos        | `font-text`     | EB Garamond        | Min 18px, line-height 1.5-1.6     |
| Botones         | `font-btn`      | VELISTA o Playfair | Bold Italic, uppercase            |
| Labels/Captions | `font-caption`  | Inter              | UI small text                     |

---

## 3. ESTILO DE BOTONES (Global Unificado)

### Reglas de Botones

1. **Tipografía:** VELISTA o Playfair Display Bold Italic
2. **Transformación:** TODO MAYÚSCULAS
3. **Tamaño:** FIJO - `0.875rem` (14px) para TODOS los botones
4. **Letter-spacing:** 1px o 2px
5. **Color de fondo:** beige general (`#FFF2DB`) o color de la sección
6. **Color de texto:** según sección (ver tabla de colores)
7. **Bordes:** Apenas redondeados (`0px 15px`) o rectos, pero **IGUALES en todos**
8. **Sombras:** Eliminar sombras extrañas

### Clases de Botones por Sección

```css
/* BASE - USAR COMO PATRÓN */
.btn-daluz {
  font-family: var(--font-title), "VELISTA", serif;
  font-size: 0.875rem; /* FIJO - 14px */
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: #fff2db;
  color: #791010;
  border-radius: 0px 15px;
  border: none;
  padding: 0.75rem 1.5rem;
  transition: opacity 200ms;
}

.btn-daluz:hover {
  opacity: 0.9;
}

/* Variantes por sección */
.btn-procesos {
  --btn-bg: #fff2db;
  --btn-text: #011f18;
}

.btn-alkimya {
  background-color: #7a160e;
  color: #fff4e0;
}

.btn-tienda {
  background-color: #7a160e;
  color: #fff4e0;
}

.btn-umbral {
  background-color: #fff2db;
  color: #791010;
}
```

### Checklist de Botones

- [ ] ¿Todos los botones usan la misma tipografía (VELISTA o Playfair)?
- [ ] ¿Todos tienen uppercase?
- [ ] ¿Todos tienen el mismo font-size (0.875rem)?
- [ ] ¿Letter-spacing es consistente (1px o 2px)?
- [ ] ¿Border-radius es consistente (0px 15px)?
- [ ] ¿No hay sombras extrañas?

---

## 4. ANIMACIONES Y EFECTOS

### Reglas de Animación

- **Respetar `prefers-reduced-motion`**: Usar Framer Motion o BlurText según patrón existente
- **GPU-accelerated**: Usar `transform` y `opacity` para animaciones
- **60fps**: No usar animaciones que causen jank

### Clases de Animación Existentes

```css
/* Float suave */
@keyframes alkimya-float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Fade in desde abajo */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 5. COMPONENTES Y ARQUITECTURA

### Estructura de Componentes

```
src/components/
├── ui/                    # Base Shadcn/ui
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
└── ui/brand/             # Componentes específicos DaLuz
    ├── alkimya/
    ├── procesos/
    └── ...
```

### Límites de Tamaño

- **Componentes React:** < 200 líneas
- **Servicios/API:** < 250 líneas
- **Componentes > 150 líneas:** Planificar extracción

### ThemeContext

- Función `applyGlobalTheme(theme)` aplica CSS vars y clase body
- Themes por línea de producto: `alma-terra`, `ecos`, `jade-ritual`, `umbral`, `utopica`, `default`

---

## 6. ACCESIBILIDAD Y CONTRASTE

### Contraste WCAG 2.1 AA

| Fondo             | Texto allowed | Ratio mínimo |
| ----------------- | ------------- | ------------ |
| `#FFF2DB` (beige) | `#791010`     | 4.5:1 ✅     |
| `#F0EACE` (crema) | `#791010`     | 4.5:1 ✅     |
| `#7A160E` (bordó) | `#FFF4E0`     | 4.5:1 ✅     |
| `#285D30` (verde) | `#FFF4E0`     | 4.5:1 ✅     |
| `#051341` (azul)  | `#FFFFFF`     | 4.5:1 ✅     |

### Checklist de Accesibilidad

- [ ] Contraste mínimo 4.5:1 en todos los textos
- [ ] No usar `#000000` ni `#333333` en body text
- [ ] Focus visible en todos los elementos interactivos
- [ ] Labels asociados en formularios
- [ ] `prefers-reduced-motion` respetado

---

## 7. CHECKLIST PRE-COMMIT

- [ ] ¿Usa la paleta correcta (variables CSS / Tailwind)?
- [ ] ¿Tipografía adecuada según jerarquía (VELISTA, Playfair, EB Garamond)?
- [ ] ¿Botones unificados con mismo estilo?
- [ ] ¿Font-size 0.875rem en todos los botones?
- [ ] ¿Letter-spacing 1px o 2px?
- [ ] ¿Border-radius consistente (0px 15px)?
- [ ] ¿No usa negros/grises en body text?
- [ ] ¿Contraste WCAG 4.5:1?
- [ ] ¿Respeta `prefers-reduced-motion`?
- [ ] ¿Componentes < 200 líneas?
- [ ] ¿Consistente con UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md?

---

## 8. REFERENCIAS

- **Docs del módulo:** `Docs/modules/00-frontend-ui/MODULE.md`
- **Sistema de diseño:** `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Paleta de colores (Google Drive):** https://drive.google.com/drive/folders/168yYEpWxCoJlwlfqfzyjFdFjOzlU3kRE
