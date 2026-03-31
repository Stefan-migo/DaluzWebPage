# Architecture Design Document: Sistema Tesoros Da Luz

## 1. Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DA LUZ CONSCIENTE                              │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  E-Commerce  │  │     Auth     │  │   Content    │  │ Tesoros   │ │
│  │   Context    │  │   Context    │  │   Context    │  │  Access   │ │
│  │              │  │              │  │              │  │  Context  │ │
│  │ • Products   │  │ • auth.users │  │ • Sanity CMS │  │ • user_   │ │
│  │ • Orders     │  │ • profiles   │  │ • member-    │  │   treasures│
│  │ • Cart       │  │ • admin_users│  │   shipContent│  │ • RLS     │ │
│  │ • MercadoPago│  │              │  │ • product-   │  │ • Hooks   │ │
│  │              │  │              │  │   Content    │  │ • API     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘ │
│         │                │                 │                  ▲        │
│         │                │                 │                  │        │
│         └────────────────┴─────────────────┴──────────────────┘        │
│                              ShARED                                     │
│                    Supabase (DB) + Sanity (CMS)                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Delimitación de Responsabilidades

| Context            | Responsabilidad                | Datos Propios          |
| ------------------ | ------------------------------ | ---------------------- |
| **E-Commerce**     | Catálogo, pedidos, pago        | Products, Orders, Cart |
| **Auth**           | Identidad, sesión              | auth.users, profiles   |
| **Content**        | Contenido editorial            | Sanity documents       |
| **Tesoros Access** | Permisos de acceso a contenido | user_treasures, RLS    |

---

## 2. Data Model

### 2.1 Supabase Schema

#### Nueva tabla: `user_treasures`

```sql
-- =====================================================
-- Tabla: user_treasures
-- Propósito: Almacena los access_ids que cada usuario
--            ha adquirido mediante compra
-- =====================================================
CREATE TABLE public.user_treasures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_id TEXT NOT NULL, -- ej: 'linea-umbral', 'kit-alkimya', 'umbral-exclusive'
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL, -- opcional, para trazabilidad
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- opcional, para trazabilidad
  granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ, -- null = permanente
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Un usuario no puede tener duplicado del mismo access_id
  UNIQUE(user_id, access_id)
);

-- Índice para consultas rápidas de acceso
CREATE INDEX idx_user_treasures_user ON public.user_treasures(user_id);
CREATE INDEX idx_user_treasures_access ON public.user_treasures(access_id);
CREATE INDEX idx_user_treasures_expires ON public.user_treasures(expires_at)
  WHERE expires_at IS NOT NULL;

-- Trigger updated_at
CREATE TRIGGER update_user_treasures_updated_at
  BEFORE UPDATE ON public.user_treasures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.user_treasures ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven sus propios tesoros
CREATE POLICY "Users can view own treasures" ON public.user_treasures
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Solo service_role puede insertar (webhook)
CREATE POLICY "Service role can manage treasures" ON public.user_treasures
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

COMMENT ON TABLE public.user_treasures IS
  'Almacena los access_ids que cada usuario ha adquirido para acceder a contenido exclusivo Tesoros';
```

#### Modificación: Tabla `products` (agregar `access_id`)

```sql
-- Agregar access_id a products si no existe
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS access_id TEXT;

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_access_id ON public.products(access_id);

-- Para productos que unlocked acceso a treasures
UPDATE public.products
SET access_id = slug
WHERE access_id IS NULL AND status = 'active';
```

#### Modificación: Tabla `profiles` (agregar `treasures` para acceso rápido)

```sql
-- Array de access_ids para consultas rápidas (denormalizado)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS treasures TEXT[] DEFAULT '{}';

-- Índice GIN para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_treasures ON public.profiles USING gin(treasures);
```

### 2.2 Supabase Schema (Schema Design - Best Practices)

**Rules Applied:**

- `schema-001`: Use UUIDs for primary keys
- `schema-005`: Always add updated_at triggers
- `security-001`: Enable RLS on all user-data tables
- `security-003`: Use unique constraints for user-scoped data
- `query-005`: Create targeted indexes for RLS policies

### 2.3 Sanity Schema (nuevo documento)

#### Nuevo Schema: `tesoroContent`

```typescript
// src/sanity/schemas/tesoroContent.ts
import { defineField, defineType } from "sanity";

export const tesoroContentSchema = defineType({
  name: "tesoroContent",
  title: "Contenido Tesoros",
  type: "document",
  icon: () => "💎",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (Slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "accessId",
      title: "ID de Acceso (Access ID)",
      type: "string",
      description:
        "ID único para filtrar acceso. Ej: linea-umbral, kit-alkimya, umbral-exclusive",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Línea Umbral", value: "linea-umbral" },
          { title: "Kit Alkimya", value: "kit-alkimya" },
          { title: "Umbral Exclusive", value: "umbral-exclusive" },
          { title: "Ecos Premium", value: "ecos-premium" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Meditación", value: "meditacion" },
          { title: "Ejercicio", value: "ejercicio" },
          { title: "Video", value: "video" },
          { title: "Audio", value: "audio" },
          { title: "Material", value: "material" },
          { title: "Guía", value: "guia" },
        ],
      },
    }),
    defineField({
      name: "content",
      title: "Contenido",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Texto Alternativo" }],
        },
        {
          name: "video",
          title: "Video",
          type: "object",
          fields: [
            { name: "url", type: "url", title: "URL del Video" },
            { name: "duration", type: "number", title: "Duración (minutos)" },
          ],
        },
        {
          name: "downloadable",
          title: "Archivo Descargable",
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Título" },
            { name: "file", type: "file", title: "Archivo" },
            {
              name: "type",
              type: "string",
              title: "Tipo",
              options: {
                list: ["pdf", "audio", "video", "image"],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "thumbnail",
      title: "Miniatura",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Orden de Visualización",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "expiresAt",
      title: "Fecha de Expiración (Opcional)",
      type: "datetime",
      description: "Si se define, el contenido expirará en esta fecha",
    }),
  ],
  preview: {
    select: { title: "title", accessId: "accessId" },
    prepare({ title, accessId }) {
      return { title, subtitle: `Access: ${accessId}` };
    },
  },
  orderings: [
    {
      title: "Por Orden",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
```

---

## 3. API Design

### 3.1 Webhooks

#### MercadoPago Webhook Enhancement

```typescript
// src/app/api/webhooks/mercadopago/route.ts

// AGREGAR: Al procesar pago aprobado, verificar si el producto
// tiene access_id y crear registro en user_treasures

interface PaymentApprovedHandler {
  // ... existente ...

  // NUEVO:
  const productAccessIds = await getProductAccessIds(orderItems);

  if (productAccessIds.length > 0) {
    // Usar service_role para insertar
    const { error: treasureError } = await supabaseAdmin
      .from('user_treasures')
      .upsert(
        productAccessIds.map(accessId => ({
          user_id: userId,
          access_id: accessId,
          product_id: orderItem.product_id,
          order_id: orderId,
          granted_at: new Date().toISOString()
        })),
        { onConflict: 'user_id,access_id' }
      );

    // También actualizar profiles.treasures para acceso rápido
    await updateProfileTreasures(userId);
  }
}

async function getProductAccessIds(orderItems: OrderItem[]): Promise<string[]> {
  // Query products que tienen access_id para los productos comprados
  const productIds = orderItems.map(item => item.product_id);

  const { data } = await supabaseAdmin
    .from('products')
    .select('access_id')
    .in('id', productIds)
    .not('access_id', 'is', null);

  return data?.map(p => p.access_id).filter(Boolean) ?? [];
}
```

### 3.2 API Endpoints

#### Nuevo Endpoint: GET /api/treasures

```typescript
// src/app/api/treasures/route.ts
import { createClient } from "@supabase/ssr";
import { z } from "zod";

export async function GET(request: Request) {
  const supabase = createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Obtener todos los access_ids del usuario
  const { data: treasures, error } = await supabase
    .from("user_treasures")
    .select("access_id, granted_at, expires_at, products(name)")
    .eq("user_id", user.id)
    .or("expires_at.is.null,expires_at.gt.now()");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    accessIds: treasures.map((t) => t.access_id),
    treasures: treasures,
  });
}
```

#### Nuevo Endpoint: GET /api/treasures/content

```typescript
// src/app/api/treasures/content/route.ts
// Retorna contenido de Sanity filtrado por access_ids del usuario

import { createClient } from "@supabase/ssr";
import { client as sanityClient } from "@/lib/sanity/client";

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const accessId = searchParams.get("accessId");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verificar que el usuario tiene acceso a este accessId
  const { data: treasure } = await supabase
    .from("user_treasures")
    .select("access_id")
    .eq("user_id", user.id)
    .eq("access_id", accessId)
    .or("expires_at.is.null,expires_at.gt.now()")
    .single();

  if (!treasure) {
    return Response.json({ error: "Access denied" }, { status: 403 });
  }

  // Obtener contenido de Sanity
  const content = await sanityClient.fetch(
    `
    *[_type == "tesoroContent" && accessId == $accessId && isActive == true] | order(order asc) {
      _id,
      title,
      slug,
      accessId,
      description,
      category,
      content,
      thumbnail,
      order
    }
  `,
    { accessId },
  );

  return Response.json({ content });
}
```

### 3.3 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUJO: Compra → Acceso                          │
└─────────────────────────────────────────────────────────────────────────┘

[Usuario] ────► [Carrito] ────► [Checkout] ────► [MercadoPago]
                                                   │
                                                   ▼
                                            [Pago Aprobado]
                                                   │
                                    ┌──────────────┴──────────────┐
                                    ▼                              ▼
                            [Redirect /success]          [Webhook POST]
                                    │                              │
                                    ▼                              ▼
                          [Mostrar Confirmación]       [Verificar Firma]
                                                         │
                                                         ▼
                                                  [Obtener Order]
                                                         │
                                                         ▼
                                                  [getProductAccessIds]
                                                         │
                                                         ▼
                                                  [INSERT user_treasures]
                                                         │
                                                         ▼
                                                  [UPDATE profiles.treasures]
                                                         │
                                                         ▼
                                                  [Enviar Email con acceso]
                                                         │
                                                         ▼
                                                  [Return 200 OK]

[Usuario] ────► [Página Tesoros] ────► [GET /api/treasures]
                                               │
                                               ▼
                                      [Verificar Sesión]
                                               │
                                               ▼
                                      [SELECT user_treasures]
                                               │
                                    ┌──────────┴──────────┐
                                    ▼                     ▼
                              [access_ids]          [Sin acceso]
                                    │                     │
                                    ▼                     ▼
                            [GET /api/treasures/   [Mostrar "Sin acceso"]
                                content?accessId=X]           │
                                    │                          │
                                    ▼                          │
                            [Validar accessId]                 │
                                    │                          │
                         ┌──────────┴──────────┐               │
                         ▼                     ▼               │
                    [Válido]               [Inválido]            │
                         │                     │                │
                         ▼                     ▼                │
                  [Fetch Sanity]        [403 Access Denied]     │
                         │                                        │
                         ▼                                        │
                  [Return Content] ◄────────────────────────────┘
```

---

## 4. Security Model

### 4.1 Row Level Security (RLS)

```sql
-- =====================================================
-- RLS: user_treasures
-- =====================================================

-- Política 1: Usuarios solo ven sus propios treasures
CREATE POLICY "Users can view own treasures" ON public.user_treasures
  FOR SELECT USING (auth.uid() = user_id);

-- Política 2: Solo service_role puede insertar/actualizar
CREATE POLICY "Service role can manage treasures" ON public.user_treasures
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- RLS: profiles (nuevo campo treasures)
-- =====================================================

-- Política: Usuarios solo ven/modifican su propio perfil
CREATE POLICY "Users can view own profile treasures" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile treasures" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 4.2 Sanity Access Control

```typescript
// src/lib/sanity/client.ts
// GROQ query con filtro de access_id

export async function getTesoroContent(userAccessIds: string[]) {
  const query = `
    *[_type == "tesoroContent" 
      && isActive == true 
      && accessId in $accessIds
    ] | order(order asc) {
      _id,
      title,
      slug,
      "accessId": accessId,
      description,
      category,
      content,
      "thumbnail": thumbnail.asset->url,
      order
    }
  `;

  return client.fetch(query, { accessIds: userAccessIds });
}
```

### 4.3 Validaciones

```typescript
// src/lib/validations/treasures.ts
import { z } from "zod";

export const TreasureAccessSchema = z.object({
  access_id: z.string().min(1),
  user_id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
  granted_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().nullable().optional(),
});

export const TreasureContentQuerySchema = z.object({
  accessId: z.string().min(1),
});
```

---

## 5. Dependency Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐ │
│  │  Header.tsx     │  │ tesoros-daluz   │  │ useTreasures (hook)     │ │
│  │  Link to /tesoros│ │ /page.tsx       │  │ - getUserTreasures()    │ │
│  └─────────────────┘  └─────────────────┘  │ - hasAccess(accessId)   │ │
│                                               └─────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
          ┌─────────────────┐ ┌──────────────┐ ┌───────────────────┐
          │ /api/treasures  │ │ /api/treas- │ │ /api/webhooks/    │
          │                 │ │ ures/content │ │ mercadopago       │
          └────────┬────────┘ └──────┬───────┘ └─────────┬─────────┘
                   │                │                    │
                   ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SUPABASE (Postgres + RLS)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ user_treasures│  │  profiles   │  │  products   │  │   orders    │ │
│  │ • user_id    │  │ • treasures[]│  │ • access_id │  │ • id        │ │
│  │ • access_id  │  │              │  │              │  │ • user_id   │ │
│  │ • granted_at │  │              │  │              │  │             │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SANITY CMS                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ tesoroContent                                                     │   │
│  │ • _id, title, slug, accessId, content, thumbnail               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Gap Analysis

### 6.1 Estado Actual vs Requerido

| Componente             | Estado Actual             | Estado Requerido            | Gap                    |
| ---------------------- | ------------------------- | --------------------------- | ---------------------- |
| **Products**           | No tiene `access_id`      | Agregar columna `access_id` | 🔴 Crear migración     |
| **user_treasures**     | No existe tabla           | Crear tabla con RLS         | 🔴 Crear migración     |
| **profiles**           | No tiene `treasures[]`    | Agregar columna `treasures` | 🔴 Crear migración     |
| **Sanity schema**      | No existe `tesoroContent` | Crear schema completo       | 🔴 Crear archivo       |
| **Webhook MP**         | Actualiza orders          | + Insert user_treasures     | 🟡 Modificar existente |
| **API /api/treasures** | No existe                 | Crear endpoint              | 🔴 Crear archivo       |
| **Frontend hook**      | No existe `useTreasures`  | Crear hook                  | 🔴 Crear archivo       |
| **Página Tesoros**     | Existe estática           | Filtrar por acceso          | 🟡 Modificar existente |
| **RLS**                | RLS en products, orders   | + RLS en user_treasures     | 🔴 Crear políticas     |

### 6.2 Priorización de Gaps

| Prioridad | Gap                               | Esfuerzo |
| --------- | --------------------------------- | -------- |
| 🔴 Alta   | Tabla `user_treasures` + RLS      | 2 horas  |
| 🔴 Alta   | Modificar webhook MP              | 3 horas  |
| 🔴 Alta   | API `/api/treasures`              | 2 horas  |
| 🟡 Media  | Hook `useTreasures`               | 1 hora   |
| 🟡 Media  | Modificar página Tesoros          | 2 horas  |
| 🟡 Media  | Agregar `access_id` a products    | 1 hora   |
| 🟢 Baja   | Schema Sanity `tesoroContent`     | 2 horas  |
| 🟢 Baja   | Actualizar profiles con treasures | 1 hora   |

**Total estimado:** ~14 horas

---

## 7. Implementation Phases

### Phase 1: Foundation (5 horas)

1. Crear tabla `user_treasures` con RLS
2. Agregar `access_id` a products
3. Modificar webhook MercadoPago

### Phase 2: API Layer (3 horas)

4. Crear `/api/treasures`
5. Crear `/api/treasures/content`

### Phase 3: Frontend (4 horas)

6. Crear hook `useTreasures`
7. Modificar página `/alkimya/tesoros-daluz`
8. Actualizar Header con estado de acceso

### Phase 4: CMS & Polish (2 horas)

9. Crear schema Sanity `tesoroContent`
10. Agregar datos de prueba

---

## 8. Decision Log

| ID      | Decisión                             | Contexto                 | Consecuencias                                 |
| ------- | ------------------------------------ | ------------------------ | --------------------------------------------- |
| ADR-001 | Usar Supabase Auth, no Clerk         | Proyecto existente       | Tabla user_treasures necesaria                |
| ADR-002 | Denormalizar `treasures` en profiles | Consultas frecuentes     | Sincronización requerida                      |
| ADR-003 | Service role para inserts            | Webhook no tiene usuario | Seguridad mejorada                            |
| ADR-004 | access_id = product.slug por defecto | Simplicidad              | Productos existentes obtienen acceso por slug |
