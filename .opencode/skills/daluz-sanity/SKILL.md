---
name: daluz-sanity
description: Guía para el módulo Sanity de DA LUZ: schemas, queries GROQ, integración Next.js, contenido marketing, membresía y tesoros. Usar al modificar o crear schemas Sanity, queries, lib/sanity, webhooks de revalidación, o contenido del CMS.
---

# Sanity CMS - Guía de Desarrollo

## Alcance

Gestión de contenidos de DA LUZ en Sanity.io: schemas personalizados, queries GROQ, integración con Next.js, webhooks de revalidación, contenido de marketing (blog, páginas), membresía (drip content), y sistema de tesoros (acceso basado en IDs).

---

## Requerimientos del Cliente

### Resumen de Necesidades (Según Notion)

El cliente quiere **autonomía total** para gestionar contenidos estacionales sin depender del equipo técnico:

1. **Enlaces Externos Dinámicos**
   - Activos y Origen: 3 enlaces
   - Procesos: 2 enlaces
   - Sesiones y Ciclos: 3+3 enlaces
   - Manifiesto/Reciclaje: 1-2 enlaces

2. **Textos Editables**
   - Títulos y descripciones de "Sesiones" y "Ciclos"

3. **Membresía - Relative Drip Content**
   - Campo `dias_para_desbloqueo` (0, 7, 14, 21...) en lugar de fecha fija
   - Fecha de inicio guardada en Clerk `publicMetadata.start_date`
   - Cálculo: `Hoy - start_date >= dias_para_desbloqueo`

4. **Sistema de Tesoros**
   - Campo `required_id` ✅ (ya existe)
   - Videos via Bunny.net (URL externa)
   - Audio MP3 y PDF (archivos)
   - Portable Text para descripciones

5. **Permisos de Archivos**
   - Subida de archivos pesados (audios/PDFs de alta calidad)

---

## Arquitectura de Sanity

### Estructura de Archivos

```
sanity.config.ts              # Configuración principal del Studio
sanity.cli.ts                  # CLI configuration
src/sanity/
├── env.ts                     # Variables de entorno (projectId, dataset, apiVersion)
├── lib/
│   ├── client.ts              # Cliente Sanity (createClient)
│   ├── image.ts               # Configuración de imágenes
│   ├── live.ts                # Live queries (opcional)
│   └── queries.ts             # Queries GROQ predefinidas
├── schemas/
│   ├── index.ts               # Exporta todos los schemas
│   ├── post.ts                # Blog posts
│   ├── author.ts              # Autores del blog
│   ├── category.ts            # Categorías del blog
│   ├── page.ts                # Páginas genéricas
│   ├── productContent.ts      # Contenido de productos
│   ├── membershipContent.ts   # Contenido de membresía
│   ├── tesoroContent.ts       # Sistema de tesoros
│   └── testimonial.ts         # Testimonios
├── schemaTypes/
│   ├── index.ts
│   ├── blockContentType.ts   # Portable Text
│   └── ...
└── structure.ts               # Custom desk structure
```

### Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=token_para_server_side
```

---

## Schemas Existentes

### tesoroContent (🎁) - ✅ COMPLETO

```typescript
// Ubicación: src/sanity/schemas/tesoroContent.ts
// Estado: YA TIENE todos los campos necesarios

Campos:
- title, slug, description
- required_id: "tesoro-gral" | "linea-ecos" | "linea-umbral" | ... | "kit-alkimya"
- content_type: "video" | "audio" | "pdf" | "text"
- video_url (Bunny.net)
- audio_file: { url, duration }
- pdf_file: { url, name }
- rich_text (Portable Text)
- linea, kit (organización)
- sort_order, duration_minutes
- is_active
```

**Query GROQ para filtrar por acceso:**

```groq
*[_type == "tesoroContent"
  && required_id in $userTreasures
  && is_active == true
] | order(sort_order asc) {
  _id,
  title,
  slug,
  description,
  required_id,
  content_type,
  video_url,
  audio_file,
  pdf_file,
  rich_text,
  duration_minutes
}
```

### membershipContent (🧘‍♀️) - ⚠️ REQUIERE MODIFICACIÓN

```typescript
// Ubicación: src/sanity/schemas/membershipContent.ts
// Estado: TIENE la mayoría, falta dias_para_desbloqueo

// AGREGAR este campo:
defineField({
  name: "dias_para_desbloqueo",
  title: "Días para Desbloqueo",
  type: "number",
  description:
    "Días relativos desde la fecha de inscripción. Ej: 0 (inmediato), 7 (una semana), 14 (dos semanas)",
  validation: (Rule) => Rule.required().min(0),
  initialValue: 0,
});

// NOTA: El campo releaseDate (fecha fija) puede mantenerse como fallback
// pero dias_para_desbloqueo es el que debe usarse para relative drip
```

**Query GROQ para membresía filtrada por días:**

```groq
// En el frontend, después de calcular dias_activo = hoy - start_date
*[_type == "membershipContent"
  && dias_para_desbloqueo <= $diasActivo
  && isLocked == true
] | order(moduleNumber asc) {
  _id,
  title,
  slug,
  moduleNumber,
  phase,
  description,
  dias_para_desbloqueo,
  content,
  exercises,
  downloads,
  journalPrompts,
  affirmations
}
```

### page.ts - ⚠️ REQUIERE EXTENSIÓN

```typescript
// AGREGAR: campo para enlaces externos dinámicos
defineField({
  name: "externalLinks",
  title: "Enlaces Externos",
  type: "object",
  fields: [
    {
      name: "activosYOrigen",
      title: "Activos y Origen",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Texto", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    },
    {
      name: "procesos",
      title: "Procesos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Texto", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    },
    // ... continuar para sesiones, ciclos, etc.
  ],
});
```

---

## NUEVO SCHEMA: dynamicLinks

Crear `src/sanity/schemas/dynamicLinks.ts` para gestionar enlaces dinámicos:

```typescript
import { defineField, defineType } from "sanity";

export const dynamicLinksSchema = defineType({
  name: "dynamicLinks",
  title: "Enlaces Dinámicos",
  type: "document",
  icon: () => "🔗",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "section",
      title: "Sección",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Activos y Origen", value: "activos-origen" },
          { title: "Procesos", value: "procesos" },
          { title: "Sesiones", value: "sesiones" },
          { title: "Ciclos", value: "ciclos" },
          { title: "Manifiesto", value: "manifiesto" },
          { title: "Reciclaje", value: "reciclaje" },
        ],
      },
    }),
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Texto del enlace",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Descripción",
              type: "text",
            }),
          ],
          preview: {
            select: { title: "text", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", section: "section", isActive: "isActive" },
    prepare({ title, section, isActive }) {
      return {
        title: `${isActive ? "✅" : "❌"} ${title}`,
        subtitle: section,
      };
    },
  },
});
```

---

## Queries GROQ Comunes

### Patrón: Cliente Sanity

```typescript
// src/sanity/lib/client.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Para queries con tokens (server-side):
  // useCdn: false,
  // token: process.env.SANITY_API_READ_TOKEN
});

// Helper para fetching con Next.js
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: false, tags },
  });
}
```

### Queries Predefinidas (en `src/sanity/lib/queries.ts`)

```typescript
// Blog posts
export const allPostsQuery = `*[_type == "post" && published == true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  author->{name, image},
  categories[]->{title, slug}
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  body,
  author->{name, bio, image},
  categories[]->{title, slug}
}`;

// Tesoros
export const tesorosByAccessQuery = `*[_type == "tesoroContent" 
  && required_id in $accessIds 
  && is_active == true
] | order(sort_order asc) {
  _id,
  title,
  slug,
  description,
  required_id,
  content_type,
  video_url,
  audio_file,
  pdf_file,
  rich_text,
  duration_minutes
}`;

// Membresía
export const membresiaByDaysQuery = `*[_type == "membershipContent" 
  && dias_para_desbloqueo <= $diasActivo
] | order(moduleNumber asc) {
  _id,
  title,
  slug,
  moduleNumber,
  phase,
  description,
  dias_para_desbloqueo,
  content,
  exercises,
  downloads,
  journalPrompts,
  affirmations
}`;

// Dynamic Links
export const dynamicLinksBySectionQuery = `*[_type == "dynamicLinks" 
  && section == $section 
  && isActive == true
][0] {
  title,
  links
}`;
```

---

## Integración con Next.js

### Revalidación con Webhooks

```typescript
// src/app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const { _type, slug } = body;

  // Tags para revalidación granular
  switch (_type) {
    case "post":
      revalidateTag("blog-posts");
      revalidateTag("homepage-posts");
      break;
    case "tesoroContent":
      revalidateTag("tesoros");
      break;
    case "membershipContent":
      revalidateTag("membresia");
      break;
    case "dynamicLinks":
      revalidateTag("dynamic-links");
      revalidatePath("/"); // Homepage puede usar enlaces
      break;
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
```

### Configuración de Sanity Webhook

```
URL: https://tu-dominio.com/api/revalidate?secret=TU_SECRET
Trigger: Create, Update, Delete
Filter: _type in ["post", "tesoroContent", "membershipContent", "dynamicLinks"]
```

---

## Imágenes en Sanity

### Configuración next.config.mjs

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
      pathname: '/images/**',
    },
  ],
}
```

### Query con imagen optimizada

```groq
mainImage {
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip // Low-quality image placeholder
    }
  },
  alt
}
```

### Componente Next.js

```tsx
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

export function SanityImage({ image, alt, className }) {
  const imageUrl = urlForImage(image).width(800).quality(85).url();

  return (
    <Image
      src={imageUrl}
      alt={alt || image.alt}
      fill
      className={className}
      placeholder={image.asset.metadata.lqip ? "blur" : "empty"}
      blurDataURL={image.asset.metadata.lqip}
    />
  );
}
```

---

## Portable Text (Rich Text)

### Configuración de componentes

```typescript
// src/lib/sanity/portableText.tsx
import { PortableText, PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="font-title text-4xl mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="font-title text-3xl mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="font-title text-2xl mb-2">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-brand-primary underline hover:text-brand-primary/80"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
  },
  types: {
    image: ({ value }) => (
      <figure className="my-6">
        <SanityImage image={value} className="rounded-lg" />
        {value.caption && (
          <figcaption className="text-sm text-gray-500 mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
}

export function PortableTextContent({ content }) {
  return <PortableText value={content} components={components} />
}
```

---

## Mejores Prácticas

### Schema Design

1. **Validaciones**: Siempre usar `validation: Rule => Rule.required()` en campos obligatorios
2. **Descriptions**: Agregar descripciones claras para que el cliente entienda qué poner
3. **Initial Values**: Usar `initialValue` para valores por defecto sensatos
4. **Preview**: Configurar `preview.select` para ver información útil en la lista del desk
5. **Ordenings**: Definir `orderings` para que el cliente pueda ordenar documentos

### Queries GROQ

1. **Proyecciones**: Siempre especificar los campos exactos, no usar `*`
2. **Filtros**: Usar parámetros `$variable` en lugar de valores hardcodeados
3. **Referencias**: Usar `->` para dereferenciar y `*[]` para arrays de referencias
4. **Orden**: Especificar orden explícitamente

### Performance

1. **CDN**: `useCdn: true` para producción
2. **Tags**: Usar tags para revalidación granular
3. **Proyecciones**: Minimizar campos en responses
4. **Lqip**: Usar low-quality image placeholders para perceived performance

### Permisos de Archivos (Cliente)

Para que el cliente pueda subir archivos pesados (audios, PDFs de alta calidad):

1. Ir a **Sanity Dashboard** → **Settings** → **Media**
2. Verificar que el plan permita el tamaño de archivo necesario
3. Configurar en `sanity.config.ts`:

```typescript
export default defineConfig({
  // ...
  document: {
    // Timeout para uploads grandes (en ms)
    unstable_noAuthBoundary: true,
  },
  // Para plugins que suben archivos
});
```

---

## Anti-Patrones

### Evitar

❌ No hardcodear URLs o textos que el cliente necesita cambiar estacionalmente  
❌ No usar `content_type` como string libre, usar `options` con lista predefined  
❌ No olvidar `is_active`/`published` para poder ocultar contenido sin borrarlo  
❌ No usar `file` type para URLs externas (Bunny.net), usar `url`  
❌ No crear schemas gigantes; separar en objetos reutilizables

### Preferir

✅ Crear schema `dynamicLinks` para enlaces editables  
✅ Usar `dias_para_desbloqueo` en membershipContent para relative drip  
✅ Mantener `required_id` en tesoroContent con lista de opciones predefined  
✅ Usar Portable Text para contenido que necesita formato rico  
✅ Configurar webhooks para revalidación automática

---

## Checklist de Implementación

### Nuevo Schema dynamicLinks

- [ ] Crear `src/sanity/schemas/dynamicLinks.ts`
- [ ] Agregar a `schema.types` en `sanity.config.ts`
- [ ] Agregar a desk structure
- [ ] Crear query `dynamicLinksBySectionQuery`
- [ ] Crear helper `getDynamicLinks(section)`
- [ ] Actualizar página que consume estos enlaces
- [ ] Probar webhook de revalidación

### Modificar membershipContent

- [ ] Agregar campo `dias_para_desbloqueo`
- [ ] Mantener `releaseDate` como fallback o eliminar
- [ ] Actualizar queries existentes
- [ ] Documentar en Notion cómo funciona el sistema de drip

### Configuración General

- [ ] Verificar permisos de subida de archivos en Sanity Dashboard
- [ ] Configurar webhook de revalidación
- [ ] Probar revalidación por tags
- [ ] Documentar schema en Notion para el cliente

---

## Referencias

- **Documentación Sanity**: https://www.sanity.io/docs
- **GROQ**: https://www.sanity.io/docs/groq
- **next-sanity**: https://github.com/sanity-io/next-sanity
- **Portable Text**: https://www.sanity.io/docs/portable-text
- **Webhooks**: https://www.sanity.io/docs/webhooks
- **Schema Types**: https://www.sanity.io/docs/schema-types

---

## Notas Importantes

1. **Cliente quiere autonomía**: El cliente específicamente pidió poder cambiar enlaces y textos sin depender del equipo técnico. Crear los schemas y funcionalidades necesarios.

2. **Relative Drip**: El sistema de membresía funciona con días relativos desde la inscripción, NO fechas fijas. Esto es clave para el "evergreen" del programa.

3. **Bunny.net para Videos**: El cliente usa Bunny.net, NO Sanity para videos. Solo guardar la URL.

4. **Tesoros con required_id**: El sistema de tesoros ya tiene el campo `required_id`. Verificar que las queries filtren correctamente según los permisos del usuario en Clerk.
