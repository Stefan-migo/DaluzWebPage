# Implementation Plan: Sistema Tesoros Da Luz

## Overview

**Feature:** Sistema de acceso a contenido exclusivo "Tesoros Da Luz" basado en productos comprados.

**Estimación Total:** ~14 horas

**Fases:** 4 fases incrementales

---

## Phase 1: Foundation (5 horas)

### 1.1 Crear tabla `user_treasures` [2 horas]

**Archivo:** `supabase/migrations/20260323000000_create_user_treasures.sql`

```sql
CREATE TABLE public.user_treasures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, access_id)
);

CREATE INDEX idx_user_treasures_user ON public.user_treasures(user_id);
CREATE INDEX idx_user_treasures_access ON public.user_treasures(access_id);

CREATE TRIGGER update_user_treasures_updated_at
  BEFORE UPDATE ON public.user_treasures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.user_treasures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own treasures" ON public.user_treasures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage treasures" ON public.user_treasures
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

**Criterios de aceptación:**

- [ ] Tabla creada con RLS
- [ ] Service role puede insertar
- [ ] Usuarios solo ven sus propios treasures

---

### 1.2 Agregar `access_id` a products [30 min]

**Archivo:** `supabase/migrations/20260323000001_add_access_id_to_products.sql`

```sql
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS access_id TEXT;
CREATE INDEX IF NOT EXISTS idx_products_access_id ON public.products(access_id);

-- Migrar productos activos: access_id = slug
UPDATE public.products
SET access_id = slug
WHERE access_id IS NULL AND status = 'active';
```

**Criterios de aceptación:**

- [ ] Columna `access_id` existe
- [ ] Productos activos tienen `access_id = slug`

---

### 1.3 Agregar `treasures` a profiles [30 min]

**Archivo:** `supabase/migrations/20260323000002_add_treasures_to_profiles.sql`

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS treasures TEXT[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_profiles_treasures ON public.profiles USING gin(treasures);
```

**Criterios de aceptación:**

- [ ] Columna `treasures` existe
- [ ] Índice GIN creado

---

### 1.4 Modificar Webhook MercadoPago [2 horas]

**Archivo:** `src/app/api/webhooks/mercadopago/route.ts`

**Cambios requeridos:**

```typescript
// Agregar al handler de pago aprobado:

// 1. Obtener access_ids de los productos comprados
const productAccessIds = await getProductAccessIds(orderItems, supabaseAdmin);

// 2. Si hay access_ids, insertar en user_treasures
if (productAccessIds.length > 0) {
  await grantTreasuresToUser(userId, productAccessIds, orderId, supabaseAdmin);
}

// 3. Función helper para obtener access_ids
async function getProductAccessIds(
  orderItems: OrderItem[],
  supabase: SupabaseClient,
): Promise<string[]> {
  const productIds = orderItems.map((item) => item.product_id);

  const { data } = await supabase
    .from("products")
    .select("access_id")
    .in("id", productIds)
    .not("access_id", "is", null);

  return data?.map((p) => p.access_id).filter(Boolean) ?? [];
}

// 4. Función para conceder tesoros
async function grantTreasuresToUser(
  userId: string,
  accessIds: string[],
  orderId: string,
  supabase: SupabaseClient,
): Promise<void> {
  const treasures = accessIds.map((accessId) => ({
    user_id: userId,
    access_id: accessId,
    order_id: orderId,
    granted_at: new Date().toISOString(),
  }));

  await supabase
    .from("user_treasures")
    .upsert(treasures, { onConflict: "user_id,access_id" });

  // Actualizar perfil con treasures para acceso rápido
  await syncProfileTreasures(userId, supabase);
}

// 5. Función para sincronizar profile.treasures
async function syncProfileTreasures(
  userId: string,
  supabase: SupabaseClient,
): Promise<void> {
  const { data } = await supabase
    .from("user_treasures")
    .select("access_id")
    .eq("user_id", userId)
    .or("expires_at.is.null,expires_at.gt.now()");

  const treasures = data?.map((t) => t.access_id) ?? [];

  await supabase.from("profiles").update({ treasures }).eq("id", userId);
}
```

**Criterios de aceptación:**

- [ ] Webhook inserta en user_treasures
- [ ] Profile.treasures se actualiza
- [ ] No falla si no hay access_ids

---

## Phase 2: API Layer (3 horas)

### 2.1 Crear API `/api/treasures` [1 hora]

**Archivo:** `src/app/api/treasures/route.ts`

```typescript
import { createClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: treasures, error } = await supabase
    .from("user_treasures")
    .select(
      `
      access_id,
      granted_at,
      expires_at,
      products(name)
    `,
    )
    .eq("user_id", user.id)
    .or("expires_at.is.null,expires_at.gt.now()")
    .order("granted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    accessIds: treasures.map((t) => t.access_id),
    treasures,
  });
}
```

**Criterios de aceptación:**

- [ ] Endpoint responde con accessIds del usuario
- [ ] Filtra treasures expirados
- [ ] Requiere autenticación

---

### 2.2 Crear API `/api/treasures/content` [1 hora]

**Archivo:** `src/app/api/treasures/content/route.ts`

```typescript
import { createClient } from "@supabase/ssr";
import { client as sanityClient } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const accessId = searchParams.get("accessId");

  if (!accessId) {
    return NextResponse.json({ error: "accessId required" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verificar acceso
  const { data: treasure } = await supabase
    .from("user_treasures")
    .select("access_id")
    .eq("user_id", user.id)
    .eq("access_id", accessId)
    .or("expires_at.is.null,expires_at.gt.now()")
    .single();

  if (!treasure) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Obtener contenido de Sanity
  const content = await sanityClient.fetch(
    `
    *[_type == "tesoroContent" 
      && accessId == $accessId 
      && isActive == true] 
    | order(order asc) {
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
  `,
    { accessId },
  );

  return NextResponse.json({ content });
}
```

**Criterios de aceptación:**

- [ ] Valida acceso del usuario
- [ ] Retorna contenido filtrado de Sanity
- [ ] Error 403 si no tiene acceso

---

### 2.3 Crear función RPC `has_treasure_access` [1 hora]

**Archivo:** `supabase/migrations/20260323000003_add_has_treasure_access_function.sql`

```sql
CREATE OR REPLACE FUNCTION public.has_treasure_access(
  p_user_id UUID DEFAULT auth.uid(),
  p_access_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_access BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.user_treasures
    WHERE user_id = p_user_id
      AND access_id = p_access_id
      AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO v_has_access;

  RETURN COALESCE(v_has_access, FALSE);
END;
$$;

-- Policy para usar la función
CREATE POLICY "Users can check treasure access" ON public.user_treasures
  FOR SELECT USING (auth.uid() = user_id);
```

**Criterios de aceptación:**

- [ ] Función retorna boolean
- [ ] Usuarios pueden verificar su propio acceso

---

## Phase 3: Frontend (4 horas)

### 3.1 Crear hook `useTreasures` [1 hora]

**Archivo:** `src/hooks/useTreasures.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Treasure = Database["public"]["Tables"]["user_treasures"]["Row"];

interface UseTreasuresReturn {
  treasures: Treasure[];
  accessIds: string[];
  hasAccess: (accessId: string) => boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTreasures(): UseTreasuresReturn {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchTreasures = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTreasures([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("user_treasures")
        .select("*")
        .eq("user_id", user.id)
        .or("expires_at.is.null,expires_at.gt.now()");

      if (fetchError) throw fetchError;

      setTreasures(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasures();
  }, [fetchTreasures]);

  const accessIds = treasures.map((t) => t.access_id);

  const hasAccess = useCallback(
    (accessId: string) => accessIds.includes(accessId),
    [accessIds],
  );

  return {
    treasures,
    accessIds,
    hasAccess,
    isLoading,
    error,
    refetch: fetchTreasures,
  };
}
```

**Criterios de aceptación:**

- [ ] Hook retorna treasures y accessIds
- [ ] Función hasAccess funciona
- [ ] Refetch actualiza datos

---

### 3.2 Modificar página Tesoros [2 horas]

**Archivo:** `src/app/(marketing)/alkimya/tesoros-daluz/page.tsx`

**Cambios requeridos:**

```typescript
'use client'

import { useTreasures } from '@/hooks/useTreasures'
import { createClient } from '@/lib/sanity/client'
import { useEffect, useState } from 'react'

// Contenido con accessId
interface TesoroItem {
  _id: string
  title: string
  slug: { current: string }
  accessId: string
  description?: string
  thumbnail?: { asset: { url: string } }
  category?: string
}

export default function TesorosPage() {
  const { accessIds, hasAccess, isLoading } = useTreasures()
  const [tesoroContent, setTesoroContent] = useState<TesoroItem[]>([])
  const [filteredContent, setFilteredContent] = useState<TesoroItem[]>([])

  // Cargar todo el contenido de Sanity
  useEffect(() => {
    async function loadContent() {
      const allContent = await sanityClient.fetch(`
        *[_type == "tesoroContent" && isActive == true] | order(order asc) {
          _id,
          title,
          slug,
          "accessId": accessId,
          description,
          category,
          "thumbnail": thumbnail.asset->url
        }
      `)
      setTesoroContent(allContent)
    }
    loadContent()
  }, [])

  // Filtrar según acceso
  useEffect(() => {
    if (accessIds.length === 0) {
      setFilteredContent([])
    } else {
      setFilteredContent(
        tesoroContent.filter(item => accessIds.includes(item.accessId))
      )
    }
  }, [accessIds, tesoroContent])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="tesoros-page">
      {/* Contenido disponible para el usuario */}
      {filteredContent.length > 0 ? (
        <div className="grid">
          {filteredContent.map(item => (
            <TesoroCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="no-access">
          <p>No tienes acceso a ningún tesoro todavía.</p>
          <p>Completa una compra para desbloquear contenido exclusivo.</p>
        </div>
      )}
    </div>
  )
}
```

**Criterios de aceptación:**

- [ ] Muestra contenido según acceso
- [ ] Mensaje claro si no hay acceso
- [ ] Loading state funciona

---

### 3.3 Actualizar Header [1 hora]

**Archivo:** `src/components/layout/Header.tsx`

**Agregar badge o estado de acceso en el link de Tesoros:**

```typescript
// Dentro del menú de navegación, donde está el link a /alkimya/tesoros-daluz
const { hasAccess, isLoading } = useTreasures()

// Mostrar indicador si tiene acceso
<Link
  href="/alkimya/tesoros-daluz"
  className={cn(
    "flex items-center gap-2",
    hasAccess && "text-dorado" // Resaltar si tiene acceso
  )}
>
  Tesoros Da Luz
  {hasAccess && (
    <span className="w-2 h-2 bg-green-500 rounded-full" title="Tienes acceso" />
  )}
</Link>
```

**Criterios de aceptación:**

- [ ] Badge verde si tiene acceso
- [ ] Link visible en header

---

## Phase 4: CMS & Polish (2 horas)

### 4.1 Crear schema Sanity `tesoroContent` [1 hora]

**Archivo:** `src/sanity/schemas/tesoroContent.ts` (ya definido en arquitectura)

**Registrar en:** `src/sanity/schemaTypes/index.ts`

```typescript
import { tesoroContentSchema } from "./tesoroContent";

export const schemaTypes = [
  // ... existing schemas ...
  tesoroContentSchema,
];
```

**Criterios de aceptación:**

- [ ] Schema creado en Sanity Studio
- [ ] Document type disponible

---

### 4.2 Crear API para obtener todos los treasures públicos [30 min]

**Archivo:** `src/app/api/treasures/public/route.ts`

```typescript
// Para la landing page, listar todos los treasures disponibles
// (sin filtrar por acceso)

export async function GET() {
  const { client } = await import("@/lib/sanity/client");

  const treasures = await client.fetch(`
    *[_type == "tesoroContent" && isActive == true] | order(order asc) {
      _id,
      title,
      slug,
      "accessId": accessId,
      description,
      category,
      "thumbnail": thumbnail.asset->url,
      order
    }
  `);

  return Response.json({ treasures });
}
```

**Criterios de aceptación:**

- [ ] Endpoint público retorna lista de treasures

---

### 4.3 Actualizar tipos Database [30 min]

**Archivo:** `src/types/database.ts`

**Agregar tabla `user_treasures`:**

```typescript
user_treasures: {
  Row: {
    id: string;
    user_id: string;
    access_id: string;
    product_id: string | null;
    order_id: string | null;
    granted_at: string;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
  }
  // ... Insert, Update, Relationships
}
```

**Criterios de aceptación:**

- [ ] Tipos actualizados
- [ ] TypeScript compila

---

## Timeline

| Phase                 | Duración     | Features                           |
| --------------------- | ------------ | ---------------------------------- |
| Phase 1: Foundation   | 5 horas      | Tabla user_treasures, RLS, Webhook |
| Phase 2: API Layer    | 3 horas      | APIs /treasures, RPC function      |
| Phase 3: Frontend     | 4 horas      | Hook, Página, Header               |
| Phase 4: CMS & Polish | 2 horas      | Sanity schema, tipos               |
| **Total**             | **14 horas** |                                    |

---

## Acceptance Criteria Globales

- [ ] Usuario que compra producto con `access_id` tiene acceso en < 5 min
- [ ] Página Tesoros muestra solo contenido con accessIds del usuario
- [ ] RLS previene acceso no autorizado a user_treasures
- [ ] Sanity filtra contenido por access_id del usuario
- [ ] Sistema funciona con productos existentes (access_id = slug)
- [ ] Email de confirmación incluye link a Tesoros (futuro)

---

## Risks

| Risk                            | Likelihood | Impact | Mitigation                        |
| ------------------------------- | ---------- | ------ | --------------------------------- |
| Webhook falla                   | Low        | High   | Log en webhook_logs, retry manual |
| Access_id no existe en producto | Medium     | Medium | Fallback a slug, migrar datos     |
| Sanity no tiene contenido       | High       | Low    | Crear contenido de prueba         |
| RLS bloquea acceso válido       | Medium     | High   | Probar con usuario test           |
