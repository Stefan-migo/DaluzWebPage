---
name: daluz-marketing-contenido
description: Guía para desarrollar el módulo Marketing & contenido de DA LUZ: landing, blog, Alkimya, filosofía, políticas. Usar al modificar BlogCard, HeroSection, páginas de blog, Alkimya, filosofía, políticas, integración Sanity, o backgrounds de marketing.
---

# Marketing & contenido - Guía de Desarrollo

## Alcance

Landing (`/`), blog (`/blog`, `/blog/[slug]`), Alkimya (`/alkimya/*`), filosofía (`/filosofia-proposito`, `/nuestra-filosofia`), políticas (`/politicas/*`). **No incluye servicios ni membresía** (módulos separados).

---

## Reglas de Código

### Convenciones

- **BlogCard**: Recibir `id`, `title`, `excerpt`, `slug`, `publishedAt`, `mainImage`, `author`, `categories`, `estimatedReadingTime`, `featured`.
- **Links a blog**: Siempre usar `/blog/${slug}` (slug de Sanity). Guardados: `/blog/guardados`.
- **Imágenes**: `next/image` con `fill` o `width`/`height`; `alt` obligatorio en imágenes de blog.
- **Paleta**: `#AE0000` (brand-primary), `#F0EACE` (bg-cream), `#FFF4B3` (bg-lighter); clases `font-title`, `font-subtitle`, `font-text`.

### Patrones a seguir

1. **Fetch Sanity (blog)**:
   ```ts
   const posts = await client.fetch(queries.allPosts, {}, {
     next: { revalidate: 60, tags: ['blog-posts', 'homepage-posts'] }
   });
   ```

2. **Metadata en blog detalle**:
   ```ts
   export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
     const post = await getPostBySlug(params.slug);
     return {
       title: post.seo?.title || post.title,
       description: post.seo?.description || post.excerpt,
       openGraph: { ... }
     };
   }
   ```

3. **Backgrounds**: Usar componentes SVG de `@/components/svg/SVGComponents` (SobreNosotrosBackground, AlkimyaBackground, BlogBackground, etc.) con `bgColor` y `waveColor` según sección.

4. **BlogShareButtons**: Compartir (navigator.share o copiar), Copiar enlace, Guardar para después (localStorage `daluz-saved-posts` con `{ id, slug, title }`). Botón "Volver al blog" en hero: `div` con `mb-6 w-fit` para margen; estilo basal `text-white bg-white/10`, hover `bg-white/15`. "Ver más artículos": `font-caption`, `border-radius: 0 15px`.

5. **Alkimya**: Layout importa `alkimya.css` y `biotipos.css`. Clases `manifiesto-*`, `section-manifiesto-*`, `activos-origen-*` tienen breakpoints complejos; no modificar sin revisar `src/styles/alkimya.css`.

### Anti-patrones a evitar

- No usar `any` en interfaces de blog post; tipar `content` como `PortableTextBlock[]` o `Block[]`.
- No añadir `console.log` en producción; eliminar logs de debug antes de commit.
- No crear páginas enlazadas sin implementar; si el Footer enlaza a `/politicas/terminos`, la página debe existir.
- No duplicar interfaces de BlogPost; mantener en `src/lib/sanity/client.ts` o `src/types/blog.ts`.
- No usar `cache: 'no-store'` sin motivo; preferir `revalidate` con tags para revalidación.

---

## Arquitectura

### Estructura esperada

```
src/app/(marketing)/
├── layout.tsx          # Header + Footer
├── page.tsx            # Landing (refactorizar si > 200 líneas)
├── blog/
│   ├── page.tsx        # Listado (búsqueda, filtros, enlace guardados)
│   ├── [slug]/page.tsx # Detalle (compartir, copiar enlace, guardar)
│   └── guardados/      # Artículos guardados (localStorage)
├── alkimya/
│   ├── layout.tsx      # alkimya.css, biotipos.css
│   ├── page.tsx
│   ├── activos-origen/
│   ├── biotipos-doshas/
│   ├── tesoros-daluz/
│   └── tu-ceremonia/
│       ├── page.tsx
│       ├── facial/
│       ├── capilar/     # pendiente
│       └── corporal/    # pendiente
├── filosofia-proposito/
├── nuestra-filosofia/
└── politicas/
    ├── envio/
    ├── terminos/       # pendiente
    └── privacidad/     # pendiente
```

### Separación de responsabilidades

- **Contenido**: Sanity para blog; políticas y filosofía pueden ser estáticos o CMS.
- **Presentación**: Componentes en `components/ui/brand/` (BlogCard); secciones en páginas.
- **Estilos**: `alkimya.css` para Alkimya; `tu-ceremonia.css` para ceremonia; Tailwind para resto.

### Integración con el sistema

- **Header**: Usa `/api/blog/latest` para dropdown Blog; enlaces a Alkimya, Raices Da Luz.
- **Footer**: Enlaces a políticas; si se añaden políticas, actualizar `footerSections`.
- **Webhook**: Sanity envía POST a `/api/revalidate`; revalida blog, homepage, tags.

---

## Mejores Prácticas

### Performance

- **Fetch**: `revalidate: 60` para listados; `revalidate: 30` para detalle; tags para revalidación granular.
- **Imágenes**: `next/image` con `sizes` adecuado; `remotePatterns` en next.config para Sanity CDN.
- **Landing**: Considerar `dynamic` o `loading` para secciones pesadas; extraer componentes para code splitting.

### SEO

- **Metadata**: `generateMetadata` en blog detalle; `metadata` en blog listado.
- **Slugs**: Usar slugs de Sanity para URLs amigables.
- **Alt**: Siempre en `mainImage`; fallback a `title` si no hay alt.

### Mantenibilidad

- **Componentes**: < 200 líneas; extraer secciones de landing a `LandingHeroSection`, `LandingBlogSection`, etc.
- **Servicios**: < 250 líneas; si la lógica de fetch crece, extraer a `src/lib/sanity/blog.ts`.
- **Tipos**: `BlogPost`, `Category`, `Author` en `src/types/blog.ts` o junto a client.

### Accesibilidad

- `prefers-reduced-motion` en alkimya.css para animaciones.
- Alt en imágenes; labels en formularios.
- Contraste de texto en fondos SVG (verificar en mobile/desktop).

---

## Refactorización

### Cuándo refactorizar

- **Landing page**: Si supera 200 líneas; extraer secciones a componentes.
- **Blog detalle**: Si `portableTextComponents` crece; extraer a `BlogPortableText.tsx`.
- **Alkimya**: Si se repiten patrones de cards; crear `ManifiestoCard` reutilizable.

### Cómo refactorizar sin romper

1. **Sanity**: Cambiar schema → actualizar queries; actualizar tipos en client.
2. **Alkimya CSS**: Las clases son específicas; no renombrar sin buscar en todo el proyecto.
3. **Revalidación**: Si añades tags nuevos, actualizar webhook en `/api/revalidate`.

---

## Checklist Pre-Commit

- [ ] ¿El componente supera 200 líneas? → Extraer subcomponentes.
- [ ] ¿El cambio afecta a Sanity? → Verificar queries y schemas.
- [ ] ¿Hay `console.log`? → Eliminar.
- [ ] ¿Se usa `any`? → Reemplazar por tipos explícitos.
- [ ] ¿Se añaden enlaces a nuevas páginas? → Crear las páginas o documentar deuda.
- [ ] ¿El Footer enlaza a páginas existentes? → Verificar `/politicas/*`.
- [ ] ¿Metadata en nuevas páginas? → Añadir `metadata` o `generateMetadata`.
- [ ] `npm run lint` y `npm run type-check` pasan.

---

## Referencias

- **Docs del módulo**: `Docs/modules/05-marketing-contenido/MODULE.md`
- **Overview**: `Docs/PROJECT_OVERVIEW.md`
- **UI/UX**: `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`
- **Skill global**: `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
