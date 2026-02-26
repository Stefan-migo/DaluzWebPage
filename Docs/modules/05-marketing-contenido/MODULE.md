# Marketing & contenido - Documentación del Módulo

**Módulo:** 05 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025 (Blog: guardados, compartir, copiar enlace, botón Volver al blog, Ver más artículos)

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo Marketing & contenido cubre la presencia pública de DA LUZ CONSCIENTE más allá del e-commerce:

- **Landing page**: Punto de entrada con hero, manifiesto, líneas de producto, filosofía, blog destacado, galería y contacto
- **Blog**: Contenido educativo sobre neurocosmética, bienestar holístico y vida consciente
- **Alkimya**: Sección educativa sobre manifiesto, activos, biotipos, ceremonia y tesoros
- **Filosofía**: Valores, propósito y visión de la marca
- **Políticas**: Información legal y de envíos para transparencia y cumplimiento

### 1.2 Objetivos de negocio

- Posicionar la marca como referente en biocosmética consciente
- Educar al usuario sobre neurocosmética, biotipos y rituales
- Generar confianza mediante transparencia (activos, filosofía, políticas)
- Captar leads mediante formulario de contacto y CTAs hacia tienda/servicios
- Mejorar SEO con contenido estructurado y metadata dinámica

### 1.3 Objetivos técnicos

- Contenido dinámico desde Sanity (blog) con revalidación automática
- Páginas estáticas optimizadas para performance (Alkimya, filosofía, políticas)
- Diseño consistente con sistema de backgrounds SVG y paleta de marca
- Componentes reutilizables (BlogCard, HeroSection) y layouts compartidos

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción | Estado |
|------|---------|-------------|--------|
| `/` | `src/app/(marketing)/page.tsx` | Landing con hero, manifiesto, líneas, blog, galería, contacto | ✅ Completa |
| `/blog` | `src/app/(marketing)/blog/page.tsx` | Listado de artículos con búsqueda y filtros por categoría | ✅ Completa |
| `/blog/[slug]` | `src/app/(marketing)/blog/[slug]/page.tsx` | Detalle de artículo con Portable Text, compartir y guardar | ✅ Completa |
| `/blog/guardados` | `src/app/(marketing)/blog/guardados/page.tsx` | Lista de artículos guardados para después (localStorage) | ✅ Completa |
| `/alkimya` | `src/app/(marketing)/alkimya/page.tsx` | Manifiesto Alkimyco y valores | ✅ Completa |
| `/alkimya/activos-origen` | `src/app/(marketing)/alkimya/activos-origen/page.tsx` | Ingredientes y procedencia | ✅ Completa |
| `/alkimya/biotipos-doshas` | `src/app/(marketing)/alkimya/biotipos-doshas/page.tsx` | Biotipos y doshas | ✅ Completa |
| `/alkimya/tesoros-daluz` | `src/app/(marketing)/alkimya/tesoros-daluz/page.tsx` | Regalos alkímicos | ✅ Completa |
| `/alkimya/tu-ceremonia` | `src/app/(marketing)/alkimya/tu-ceremonia/page.tsx` | Rituales y ceremonias | ✅ Completa |
| `/alkimya/tu-ceremonia/facial` | `src/app/(marketing)/alkimya/tu-ceremonia/facial/page.tsx` | Ceremonia facial | ✅ Completa |
| `/alkimya/tu-ceremonia/capilar` | — | Ceremonia capilar | **❌ No existe** |
| `/alkimya/tu-ceremonia/corporal` | — | Ceremonia corporal | **❌ No existe** |
| `/filosofia-proposito` | `src/app/(marketing)/filosofia-proposito/page.tsx` | Filosofía y propósito | ⚠️ Placeholder |
| `/nuestra-filosofia` | `src/app/(marketing)/nuestra-filosofia/page.tsx` | Nuestra filosofía | ⚠️ Placeholder |
| `/politicas/envio` | `src/app/(marketing)/politicas/envio/page.tsx` | Políticas de envío | ✅ Completa |
| `/politicas/terminos` | — | Términos y condiciones | **❌ No existe** |
| `/politicas/privacidad` | — | Política de privacidad | **❌ No existe** |

**Nota:** El Footer enlaza a `/politicas/terminos` y `/politicas/privacidad`, pero solo existe `/politicas/envio`. Las rutas `/alkimya/tu-ceremonia/capilar` y `/alkimya/tu-ceremonia/corporal` están enlazadas desde tu-ceremonia pero no tienen página.

### 2.2 APIs (endpoints)

| Método | Endpoint | Descripción | Consumidor |
|--------|----------|-------------|------------|
| GET | `/api/blog/latest?limit=N` | Últimos N posts del blog | Header (dropdown Blog) |
| POST | `/api/revalidate` | Webhook Sanity para revalidar caché | Sanity Studio |

**Detalles:**
- `/api/blog/latest`: `force-dynamic`, revalida cada 60s, tags `blog-posts`, `latest-posts`
- `/api/revalidate`: Verifica firma con `SANITY_WEBHOOK_SECRET`, revalida `blog`, `blog/[slug]`, `/`, tags `blog-posts`, `homepage-posts`, `latest-posts`, etc.

### 2.3 CMS Sanity (schemas)

| Schema | Tipo | Propósito |
|--------|------|-----------|
| `post` | document | Artículos del blog (title, slug, excerpt, content, mainImage, author, categories, seo, featured) |
| `category` | document | Categorías del blog (title, slug, description, colorHex, featured) |
| `author` | document | Autores (name, slug, image, bio, specialties, email, social) |

**Contenido:** El blog está 100% en Sanity. Alkimya, filosofía y políticas son estáticos o híbridos (contenido en código).

### 2.4 Componentes principales

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| `BlogCard` | `src/components/ui/brand/BlogCard.tsx` | Tarjeta de artículo con imagen, excerpt, autor, categorías |
| `BlogPageClient` | `src/components/blog/BlogPageClient.tsx` | Listado con búsqueda, filtros por categoría, enlace a guardados |
| `BlogShareButtons` | `src/components/blog/BlogShareButtons.tsx` | Compartir (API nativa), copiar enlace, guardar para después |
| `BentoBlogGrid` / `BentoBlogCard` | `src/components/ui/brand/` | Grid Bento y cards para blog listado y landing |
| `HeroSection` | Inline en landing (no componente extraído) | Hero principal con BlurText y CTAs |
| `Header` | `src/components/layout/Header.tsx` | Navegación con dropdowns Alkimya, Blog, Raices Da Luz |
| `Footer` | `src/components/layout/Footer.tsx` | Enlaces a políticas, productos, membresía, contacto |
| `Backgrounds` | `src/components/svg/SVGComponents.tsx` | `SobreNosotrosBackground`, `AlkimyaBackground`, `BlogBackground`, etc. |
| `backgroundDesigns.ts` | `src/config/backgroundDesigns.ts` | Configuración de temas y paletas SVG |

### 2.5 Blog: UI y comportamiento

**Botón "Volver al blog"** (hero del post): Envuelto en `div` con `mb-6 w-fit` para que el margen funcione (el Link es inline-flex). Estilo basal: `text-white bg-white/10`; hover: `bg-white/15`. Fuente `font-caption uppercase tracking-wider`.

**Compartir y guardar** (BlogShareButtons): Botón "Compartir" usa `navigator.share()` o copia enlace; "Copiar enlace" copia URL al portapapeles. "Guardar para después" persiste en `localStorage` (clave `daluz-saved-posts`) con `{ id, slug, title }`. Enlace "Ver artículos guardados" → `/blog/guardados`.

**Página guardados** (`/blog/guardados`): Lista posts guardados desde localStorage; permite quitar de guardados. Estado vacío con CTA a explorar blog.

**Botón "Ver más artículos"** (final del post): `font-caption uppercase tracking-wider`, `border-radius: 0 15px`, `bg-[var(--color-brand-primary)]`.

**Blog listado**: Enlace "Ver guardados" en header de artículos y en estado vacío.

### 2.6 Estilos y diseño (Alkimya, etc.)

| Recurso | Ubicación | Propósito |
|---------|-----------|-----------|
| `alkimya.css` | `src/styles/alkimya.css` | Clases `alkimya-*`, `manifiesto-*`, `section-*`, `activos-origen-*` |
| `biotipos.css` | `src/styles/biotipos.css` | Estilos para biotipos-doshas |
| `tu-ceremonia.css` | `src/styles/tu-ceremonia.css` | Estilos para tu-ceremonia |
| `shadow-alkimya` | `tailwind.config` | Sombra de marca para cards |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo de contenido: Blog (Sanity)

```
Sanity Studio (edición) 
    → Webhook POST /api/revalidate
    → revalidatePath /blog, /blog/[slug], /
    → revalidateTag blog-posts, latest-posts, homepage-posts
    → Next.js regenera páginas en caché
```

**Fetch en páginas:**
- Landing: `client.fetch(queries.allPosts)` con `revalidate: 60`, tags `blog-posts`, `homepage-posts`
- Blog listado: `client.fetch(queries.allPosts)` y `queries.allCategories`
- Blog detalle: `client.fetch(queries.postBySlug, { slug })` con `revalidate: 30`, tag `post-${slug}`

### 3.2 Flujo de páginas estáticas (Alkimya, filosofía, políticas)

- Contenido hardcodeado en el componente (TSX)
- Layout Alkimya: `import '@/styles/alkimya.css'` y `import '@/styles/biotipos.css'`
- Subpáginas con CSS específico (tu-ceremonia.css, activos-origen en alkimya.css)

### 3.3 Dependencias con otros módulos

| Módulo | Relación |
|--------|----------|
| `(commerce)` | Landing enlaza a `/productos` y categorías; Header con menú Tienda |
| `(servicios)` | Landing enlaza a `/procesos`, `/servicios/*`; Header con menú Procesos |
| `(membresia)` | Landing enlaza a `/programa-transformacion`; Header con menú Membresía |
| `(account)` | Header con menú usuario (Login, Perfil, Mi Membresía) |
| Auth | Header usa `useAuthContext` para login/signup |
| Cart | Header usa `useCart` para toggle del carrito |

### 3.4 Diagrama simplificado

```
[Usuario] → / (Landing)
    ├── Hero → CTAs: /productos, /nuestra-historia
    ├── Manifiesto → /alkimya
    ├── Alkimya DA LUZ → /alkimya/biotipos-doshas
    ├── Líneas → /categorias/linea-*
    ├── Valor y Confianza → /alkimya/activos-origen, tu-ceremonia, tesoros-daluz, alkimya
    ├── Servicios → /procesos, /programa-transformacion
    ├── Filosofía → /filosofia-proposito (placeholder)
    ├── Blog → /blog (Sanity)
    ├── Galería → InteractiveGallery
    └── Contacto → ContactForm

[Header] → /blog (dropdown con últimos 2 posts)
[Header] → /alkimya (dropdown con sublinks)
[Footer] → /politicas/envio, /politicas/terminos, /politicas/privacidad
```

---

## 4. Fortalezas

- **Integración Sanity robusta**: Blog con post, category, author; queries GROQ; revalidación por webhook
- **Revalidación granular**: Tags por tipo de contenido; revalidatePath en webhook
- **Metadata SEO**: `generateMetadata` en blog detalle; metadata en blog listado
- **Diseño coherente**: SVG backgrounds por sección; paleta de marca (#AE0000, #F0EACE, #FFF4B3)
- **Responsive**: alkimya.css con breakpoints mobile/tablet/desktop; manifiesto con cards móviles
- **Layout compartido**: Marketing layout con Header + Footer; Alkimya layout con estilos específicos
- **Accesibilidad**: `prefers-reduced-motion` en alkimya.css; alt en imágenes

---

## 5. Debilidades y Deuda Técnica

### 5.1 Páginas enlazadas pero no creadas

| Enlace | Página destino | Estado |
|--------|---------------|--------|
| Footer → Términos y Condiciones | `/politicas/terminos` | 404 |
| Footer → Política de Privacidad | `/politicas/privacidad` | 404 |
| tu-ceremonia → IR A CEREMONIA CAPILAR | `/alkimya/tu-ceremonia/capilar` | 404 |
| tu-ceremonia → IR A CEREMONIA CORPORAL | `/alkimya/tu-ceremonia/corporal` | 404 |

### 5.2 Placeholders y contenido incompleto

- `/filosofia-proposito`: Card "Contenido en Desarrollo"
- `/nuestra-filosofia`: Texto "This page is currently under construction"

### 5.3 Código y consistencia

- **Landing page**: ~1220 líneas; excede límite de 200 líneas por componente. Requiere extracción.
- **Blog post detalle**: `content: any` en interface; `use any` en algunos lugares de PortableText
- **Schema Sanity vs queries**: `category.colorHex` en schema pero queries usan `color`; `author.social` vs `socialLinks`; `seo.metaTitle` vs `seo.title` en código
- **Debug en producción**: `console.log` en blog detalle ([slug]/page.tsx) para debugging de content
- **Búsqueda blog**: Implementada en BlogPageClient (filtro por título/excerpt)

### 5.4 Inconsistencias

- Blog post: `author.image` puede ser `asset.url` o `image` (URL directa) según query
- Blog listado usa colores `azul-profundo`, `dorado`, `tierra-media`; landing usa `#AE0000`, `#F0EACE` — paleta distinta

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Crear páginas faltantes**: `/politicas/terminos`, `/politicas/privacidad`, `/alkimya/tu-ceremonia/capilar`, `/alkimya/tu-ceremonia/corporal`
2. **Refactorizar landing**: Extraer secciones a componentes (HeroSection, ManifiestoSection, BlogSection, etc.) para mantener < 200 líneas por archivo
3. **Unificar schema Sanity con queries**: `colorHex` → `color`, `metaTitle` → `title` en seo, o documentar mapeo

### 6.2 Prioridad media

4. ~~**Implementar búsqueda blog**~~: Implementado en BlogPageClient
5. **Completar filosofía**: Contenido real en `/filosofia-proposito` y `/nuestra-filosofia`
6. **Eliminar logs de debug**: Quitar `console.log` en blog detalle
7. **Tipar Portable Text**: Reemplazar `any` por tipos explícitos de `@portabletext/react`

### 6.3 Prioridad baja

8. **Unificar paleta blog**: Usar `brand-primary`, `bg-cream` en lugar de `azul-profundo`, `dorado` para consistencia
9. **Mover políticas a Sanity**: Si el contenido cambia frecuentemente, considerar CMS
10. **Tests E2E**: Navegación landing → blog → detalle; políticas accesibles

---

## 7. Planes en Curso / Roadmap

- **Documentación modular**: Este documento forma parte del plan de documentación por módulo (12 módulos)
- **NotebookLM**: Subir `docs/modules/05-marketing-contenido/MODULE.md` para consultas con IA
- **Páginas políticas**: Pendiente de redacción legal para términos y privacidad

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios en este módulo

1. **Blog**: Modificar `src/lib/sanity/client.ts` (queries) y `src/sanity/schemas/` (schemas). Si cambias schema, actualizar queries y tipos.
2. **Alkimya**: Revisar `alkimya.css` y `biotipos.css` antes de cambiar estilos. Las clases `manifiesto-*`, `section-*` tienen breakpoints complejos.
3. **Landing**: Cada sección usa SVG backgrounds. Ver `src/components/svg/SVGComponents.tsx` y `backgroundDesigns.ts`.
4. **Políticas**: Contenido estático; si se añade legal, revisar formato y accesibilidad.

### 8.2 Puntos de atención al modificar

- **Sanity**: Si cambias `post`, `category` o `author`, ejecutar deploy de Sanity Studio y verificar webhook.
- **Revalidación**: El webhook debe tener `SANITY_WEBHOOK_SECRET` en producción. Probar con `POST /api/revalidate` con payload de prueba.
- **Diseño**: Mantener `brand-primary` (#AE0000), `bg-cream` (#F0EACE), `font-title`, `font-subtitle` según `UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`.

### 8.3 Checklist antes de hacer cambios

- [ ] ¿El cambio afecta a Sanity? → Revisar `client.ts` y schemas
- [ ] ¿El cambio afecta a rutas enlazadas? → Verificar que no existan 404s
- [ ] ¿El componente supera 200 líneas? → Planificar extracción
- [ ] ¿Se usa `any`? → Reemplazar por tipos explícitos
- [ ] ¿Hay `console.log`? → Eliminar si es debug
- [ ] ¿El Footer enlaza a páginas existentes? → Actualizar si se añaden políticas

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` — Overview del sistema
- `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` — Sistema de diseño
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` — Guías globales
- `.cursor/skills/daluz-marketing-contenido/SKILL.md` — Skill del módulo
