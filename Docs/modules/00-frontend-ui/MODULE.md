# Frontend / UI - Documentación del Módulo

**Módulo:** 00 de 12 (transversal)  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo Frontend/UI es el **sistema de diseño unificado** de DA LUZ CONSCIENTE. Resuelve:

- **Consistencia visual**: Paleta, tipografía y componentes coherentes en toda la plataforma
- **Theming dinámico**: Cambio de paleta según línea de producto (Alma Terra, Ecos, Jade, Umbral, Utópica)
- **Identidad de marca**: Estética artesanal, biocosmética consciente, valores holísticos
- **Experiencia coherente**: Desde landing hasta admin, una sola voz visual

### 1.2 Objetivos de negocio

- Fortalecer la identidad de marca DA LUZ en biocosmética artesanal
- Transmitir sofisticación y consciencia con una paleta Bordó Profundo
- Diferenciar visualmente frente a competidores genéricos
- Mejorar percepción de calidad y confianza

### 1.3 Objetivos técnicos

- Componentes reutilizables (Shadcn base + brand variants)
- Variables CSS para paleta y tipografía (evitar hex hardcodeados)
- Performance: font-display swap, optimización de assets
- Accesibilidad: WCAG 2.1 AA, prefers-reduced-motion
- Mantenibilidad: componentes < 200 líneas, variantes documentadas

---

## 2. Alcance del Módulo

### 2.1 Rutas (referencia)

| Ruta | Propósito |
|------|-----------|
| `/` | Landing principal; referencia de hero, tipografía, paleta |
| `/style-tester` | Herramienta de diseño para cliente; pruebas de paleta y componentes |
| `*` | Todas las rutas consumen el design system (transversal) |

### 2.2 Componentes principales

| Categoría | Componentes | Ubicación |
|-----------|-------------|-----------|
| **Base Shadcn** | Button, Card, Input, Dialog, Badge, etc. | `src/components/ui/` |
| **Brand** | HeroSection, ProductCard, ProductGrid, BlogCard, ServiceCard, NavigationMenu, ContentSection, FeatureHighlight, ProgressIndicator, FormComponents, TestimonialCard | `src/components/ui/brand/` |
| **Reviews** | StarRating, ReviewForm, ReviewList, ReviewItem | `src/components/ui/reviews/` |
| **Animación** | BlurText | `src/components/ui/BlurText.tsx` |
| **Layout** | Header, Footer | `src/components/layout/` |

### 2.3 Archivos de configuración

| Archivo | Propósito |
|---------|-----------|
| `src/app/globals.css` | Variables CSS, paleta, tipografía, clases base |
| `tailwind.config.ts` | Fuentes, colores, animaciones, utilidades extendidas |
| `src/contexts/ThemeContext.tsx` | Theming por línea de producto |
| `src/config/backgroundDesigns.ts` | Configuración de temas y paletas para backgrounds |

### 2.4 Assets

| Tipo | Ubicación | Propósito |
|------|-----------|-----------|
| Fuentes | `public/fonts/` | Malisha, VELISTA (custom brand) |
| Texturas | `public/images/textures/` | Por línea de producto |
| SVGs | `public/svg/` | Logos, backgrounds de sección |

**Documentación detallada:** Ver `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` para paleta, tipografía, variantes de componentes y especificaciones técnicas.

---

## 3. Arquitectura y Flujos

### 3.1 Flujo de theming

```
ThemeContext (currentTheme) 
  → applyGlobalTheme() 
  → document.body.classList.add(`theme-${theme}`)
  → CSS variables (--line-primary, --line-secondary, etc.)
  → Componentes consumen var(--line-primary) o clases Tailwind
```

### 3.2 Jerarquía tipográfica (especificaciones oficiales)

| Nivel | Uso | Fuente | Notas |
|-------|-----|--------|-------|
| **font-display** | Logo, hero, branding | Malisha | Momentos de marca |
| **font-title** | H1, H2 | VELISTA | Títulos principales |
| **font-subtitle** | H3, destacados | Playfair Display (Medium/Semi-Bold Italic) | Opción secundaria: Malisha en sentence case |
| **font-text** | Body, párrafos | EB Garamond (ideal) o Times New Roman | Mín. 18px, line-height 1.5–1.6 |
| **font-caption** | Labels, captions | Inter | Small text, UI |

### 3.3 Sistema de paletas

- **Global:** `--color-brand-primary`, `--color-text-primary`, etc.
- **Por línea:** `--alma-primary`, `--ecos-primary`, etc.
- **Dinámica:** `--line-primary`, `--line-secondary` (según ThemeContext)

### 3.4 Integración con otros módulos

- **01-ecommerce:** ProductCard, ProductGrid, CartSidebar consumen paleta y tipografía
- **05-marketing:** Landing, BlogCard, HeroSection, backgrounds SVG
- **06-servicios:** ServiceCard, estilos de ceremonia
- **Admin:** Admin layout, admin-* clases en globals.css

---

## 4. Fortalezas

- **Sistema multi-tier:** Paleta global + por línea de producto
- **Tipografía jerárquica:** 4 niveles (display, title, subtitle, text/caption)
- **BlurText:** Animaciones de entrada con Framer Motion
- **Style-tester:** Herramienta de colaboración con cliente
- **prefers-reduced-motion:** Respeta en globals.css y alkimya.css
- **Font-display swap:** Optimización de carga de fuentes
- **Variables CSS:** Facilita mantenimiento y theming

---

## 5. Debilidades y Deuda Técnica

### 5.1 Inconsistencias de paleta

- **Texto principal:** `#1C1B1A` (marrón oscuro) vs especificación **Bordó Profundo** (#601010 / #800020)
- **Hex hardcodeados:** Uso de `#AE0000`, `#1C1B1A`, `text-gray-800` en lugar de variables
- **Cuerpos de texto:** Inter en lugar de EB Garamond / Times New Roman

### 5.2 Tipografía

- **Body:** Actualmente Inter; especificación requiere EB Garamond o Times New Roman
- **Tamaño mínimo: 18px** para body; no aplicado globalmente
- **Malisha en bloques largos:** Debe reemplazarse por font-text

### 5.3 Botones

- **Tipografías inconsistentes:** font-body vs font-heading vs font-text
- **Variantes dispersas:** 20+ variantes sin unificación clara
- **Especificación:** Velista o Playfair Bold Italic, UPPERCASE, letter-spacing 1–2px

### 5.4 Componentes

- **Header.tsx:** ~944 líneas; supera límite de 200
- **globals.css:** ~1500 líneas; considerar modularización

### 5.5 Accesibilidad

- BlurText: No verifica prefer-reduced-motion explícitamente
- Contraste: Validar Bordó Profundo (#601010) sobre fondos crema

---

## 6. Mejoras Propuestas

### Prioridad alta

1. **Actualizar paleta de texto:** `--color-text-primary: #601010` (o #800020)
2. **Añadir EB Garamond:** En layout.tsx y globals.css; reemplazar Inter en body
3. **Unificar botones:** Estilo global (Velista/Playfair Bold Italic, UPPERCASE, letter-spacing)
4. **Eliminar grises/negros genéricos** en cuerpos de texto

### Prioridad media

5. **Refactorizar Header:** Extraer subcomponentes (menús, user menu, etc.)
6. **Reemplazar hex hardcodeados** por variables CSS en componentes
7. **Body mínimo 18px:** Aplicar en globals.css y variantes

### Prioridad baja

8. **Modularizar globals.css:** Separar admin, animaciones, marquee
9. **Documentar variantes de Button** en UNIFIED
10. **BlurText prefers-reduced-motion:** Verificar y respetar

---

## 7. Planes en Curso / Roadmap

- **En curso:** Migración a paleta Bordó Profundo (#601010)
- **Pendiente:** Integración EB Garamond en layout y fuentes
- **Pendiente:** Unificación global de estilos de botones
- **Pendiente:** Refactorización de Header para reducir complejidad

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios en componentes UI

1. **Revisar UNIFIED:** `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` para especificaciones
2. **Usar variables:** `var(--color-text-primary)`, `var(--line-primary)`, etc.
3. **Jerarquía tipográfica:** Aplicar font-display, font-title, font-subtitle, font-text según nivel
4. **Evitar hex hardcodeados** salvo en definiciones de variables

### 8.2 Cuándo usar variantes existentes vs crear nuevas

- **Preferir:** Variantes `brand`, `line-primary`, `elegant` en Button
- **Evitar:** Crear variantes ad-hoc sin documentar
- **Documentar:** Nuevas variantes en UNIFIED y en este módulo

### 8.3 Checklist antes de modificar

- [ ] ¿Usa la paleta correcta (variables CSS / Tailwind)?
- [ ] ¿Tipografía adecuada según jerarquía?
- [ ] ¿Respeta prefers-reduced-motion en animaciones?
- [ ] ¿Consistente con UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md?
- [ ] ¿Componente < 200 líneas?

### 8.4 Referencias

| Documento | Propósito |
|----------|-----------|
| `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` | Sistema de diseño completo, paleta, tipografía, componentes |
| `Docs/PROJECT_OVERVIEW.md` | Contexto general del proyecto |
| `.cursor/skills/daluz-frontend-ui/SKILL.md` | Guía para agentes de IA |

---

*Este módulo complementa la documentación unificada. Para detalles de paleta, tipografía y variantes de componentes, consultar siempre UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md.*
