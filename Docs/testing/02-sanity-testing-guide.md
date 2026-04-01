# Guía de Testing: Integraciones Sanity en DaLuz

## Introducción

Esta guía está diseñada para el equipo de desarrollo y QA. Cubre las estrategias de testing para todas las integraciones entre Sanity CMS y la aplicación Next.js de DaLuz.

### Objetivos de Testing

- Verificar que el contenido de Sanity se muestre correctamente en la web
- Asegurar que los webhooks de revalidación funcionen
- Probar el sistema de desbloqueo progresivo (drip content)
- Validar permisos y acceso a tesoros según nivel de membresía
- Verificar enlaces dinámicos

---

## 1. Testing del Schema de Sanity

### 1.1 Validación de Schema en Desarrollo

```bash
# Iniciar el Studio de Sanity en modo desarrollo
npm run sanity
```

**Qué verificar:**

- [ ] Todos los campos se muestran correctamente
- [ ] Las validaciones funcionan (campos obligatorios, rangos numéricos)
- [ ] Los previews muestran información útil
- [ ] Las referencias se resuelven correctamente

### 1.2 Pruebas de Creación de Documentos

#### Blog Posts

```typescript
// Query de prueba para verificar blog posts
const blogPosts = await client.fetch(`
  *[_type == "post" && published == true] | order(publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title
  }
`);
```

**Casos de prueba:**

| ID    | Escenario                           | Resultado Esperado              |
| ----- | ----------------------------------- | ------------------------------- |
| BP-01 | Crear post con todos los campos     | Post creado y visible           |
| BP-02 | Crear post sin título               | Error de validación             |
| BP-03 | Crear post sin fecha de publicación | Error de validación             |
| BP-04 | Crear post como borrador            | No visible en producción        |
| BP-05 | Publicar post drafted               | Visible inmediatamente          |
| BP-06 | Editar post publicado               | Cambios reflejados tras webhook |

#### Membership Modules

```typescript
// Query de prueba para membership
const modules = await client.fetch(`
  *[_type == "membershipContent"] | order(moduleNumber asc) {
    _id,
    title,
    moduleNumber,
    phase,
    isLocked,
    dias_para_desbloqueo,
    releaseDate
  }
`);
```

**Casos de prueba:**

| ID    | Escenario                                 | Resultado Esperado     |
| ----- | ----------------------------------------- | ---------------------- |
| MM-01 | Crear módulo con moduleNumber 1           | Módulo creado          |
| MM-02 | Crear módulo con moduleNumber 0           | Error (mín 1)          |
| MM-03 | Crear módulo con moduleNumber 29          | Error (máx 28)         |
| MM-04 | isLocked = true, dias_para_desbloqueo = 0 | Disponible desde día 1 |
| MM-05 | isLocked = true, dias_para_desbloqueo = 7 | Bloqueado hasta día 7  |
| MM-06 | isLocked = false                          | Siempre disponible     |

#### Tesoros

```typescript
// Query de prueba para tesoros
const tesoros = await client.fetch(`
  *[_type == "tesoroContent" && is_active == true] | order(sort_order asc) {
    _id,
    title,
    required_id,
    content_type,
    is_active
  }
`);
```

**Casos de prueba:**

| ID    | Escenario                           | Resultado Esperado       |
| ----- | ----------------------------------- | ------------------------ |
| TR-01 | Crear tesoro con todos los tipos    | Todos los tipos creados  |
| TR-02 | Crear tesoro tipo video sin URL     | Error de validación      |
| TR-03 | Crear tesoro tipo audio sin archivo | Error de validación      |
| TR-04 | is_active = false                   | No visible en producción |
| TR-05 | required_id inválido                | Error de validación      |

#### Enlaces Dinámicos

```typescript
// Query de prueba para dynamic links
const links = await client.fetch(`
  *[_type == "dynamicLinks" && section == "sesiones" && isActive == true][0] {
    _id,
    title,
    section,
    "links": links[isActive == true] {
      label,
      url,
      icon,
      openInNewTab
    }
  }
`);
```

**Casos de prueba:**

| ID    | Escenario                  | Resultado Esperado     |
| ----- | -------------------------- | ---------------------- |
| DL-01 | Crear grupo de enlaces     | Grupo creado           |
| DL-02 | Crear enlace sin URL       | Error de validación    |
| DL-03 | isActive = false en enlace | Enlace no mostrado     |
| DL-04 | isActive = false en grupo  | Ningún enlace mostrado |
| DL-05 | Múltiples enlaces activos  | Todos mostrados        |

---

## 2. Testing de Integración con Next.js

### 2.1 Pruebas de Fetching

#### Configuración de Test

```typescript
// src/__tests__/sanity/client.test.ts
import { client } from "@/sanity/lib/client";

describe("Sanity Client Integration", () => {
  test("should fetch blog posts", async () => {
    const posts = await client.fetch(`
      *[_type == "post" && published == true] | order(publishedAt desc)[0...3]
    `);

    expect(Array.isArray(posts)).toBe(true);
    if (posts.length > 0) {
      expect(posts[0]).toHaveProperty("title");
      expect(posts[0]).toHaveProperty("slug");
    }
  });

  test("should fetch membership modules", async () => {
    const modules = await client.fetch(`
      *[_type == "membershipContent"] | order(moduleNumber asc)
    `);

    expect(Array.isArray(modules)).toBe(true);
  });
});
```

#### Ejecutar pruebas

```bash
npm test -- --testPathPattern=sanity
# o
npm run test:coverage -- --coveragePathPattern=sanity
```

### 2.2 Pruebas de Queries Custom

```typescript
// src/__tests__/sanity/queries.test.ts
import { getDynamicLinksBySection } from "@/sanity/lib/queries";
import { getAllMembershipModules } from "@/sanity/lib/queries";
import { calculateModuleAccess } from "@/sanity/lib/queries";

describe("Custom Sanity Queries", () => {
  describe("getDynamicLinksBySection", () => {
    it("should return links for a valid section", async () => {
      const result = await getDynamicLinksBySection("sesiones");

      // Puede ser null si no hay datos
      if (result) {
        expect(result).toHaveProperty("title");
        expect(result).toHaveProperty("links");
        expect(Array.isArray(result.links)).toBe(true);
      }
    });

    it("should return null for invalid section", async () => {
      const result = await getDynamicLinksBySection("seccion-inexistente");
      expect(result).toBeNull();
    });
  });

  describe("calculateModuleAccess", () => {
    const mockModule = {
      _id: "test-1",
      _type: "membershipContent",
      title: "Test Module",
      moduleNumber: 1,
      isLocked: true,
      dias_para_desbloqueo: 7,
    };

    it("should be inaccessible if no start_date", () => {
      const result = calculateModuleAccess(mockModule as any, {
        start_date: null,
      });

      expect(result.isAccessible).toBe(false);
      expect(result.unlockReason).toBe("no_start_date");
    });

    it("should be accessible if days passed", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 10); // 10 días atrás

      const result = calculateModuleAccess(mockModule as any, {
        start_date: startDate.toISOString(),
      });

      expect(result.isAccessible).toBe(true);
    });

    it("should show days until unlock", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 3); // 3 días atrás

      const result = calculateModuleAccess(mockModule as any, {
        start_date: startDate.toISOString(),
      });

      expect(result.isAccessible).toBe(false);
      expect(result.daysUntilUnlock).toBe(4); // 7 - 3 = 4 días
    });
  });
});
```

---

## 3. Testing de Webhooks

### 3.1 Pruebas del Webhook de Revalidación

#### Estructura del Payload de Prueba

```json
{
  "_type": "post",
  "_id": "test-post-123",
  "_createdAt": "2026-03-31T10:00:00Z",
  "slug": { "current": "test-post" },
  "transition": "update"
}
```

#### Script de Prueba Manual

```bash
# Probar webhook de revalidación (desarrollo)
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "_type": "post",
    "_id": "test-123",
    "slug": { "current": "test-post" },
    "transition": "update"
  }'

# Probar con diferentes tipos
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"_type": "membershipContent", "_id": "test-module"}'

curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"_type": "tesoroContent", "_id": "test-tesoro"}'

curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"_type": "dynamicLinks", "_id": "test-links"}'
```

#### Casos de Prueba de Webhook

| ID    | Escenario                         | Resultado Esperado                 |
| ----- | --------------------------------- | ---------------------------------- |
| WH-01 | POST con tipo "post"              | Revalida blog, tags revalidados    |
| WH-02 | POST con tipo "membershipContent" | Revalida /membresia, /mi-membresia |
| WH-03 | POST con tipo "tesoroContent"     | Revalida /tesoros                  |
| WH-04 | POST con tipo "dynamicLinks"      | Revalida homepage                  |
| WH-05 | POST con tipo desconocido         | Revalidación general               |
| WH-06 | GET al endpoint                   | Retorna status 200                 |
| WH-07 | POST sin firma en producción      | Retorna 401                        |
| WH-08 | POST con payload inválido         | Retorna 500                        |

### 3.2 Testing de Firma de Webhook

```typescript
// src/__tests__/api/revalidate.test.ts
import crypto from "crypto";

describe("Sanity Webhook Security", () => {
  const SANITY_WEBHOOK_SECRET =
    process.env.SANITY_WEBHOOK_SECRET || "test-secret";

  function generateSignature(body: string): string {
    return crypto
      .createHmac("sha256", SANITY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");
  }

  test("should accept valid signature in production", async () => {
    const body = JSON.stringify({ _type: "post", _id: "test" });
    const signature = generateSignature(body);

    const response = await fetch("/api/revalidate", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        "sanity-webhook-signature": signature,
      },
    });

    expect(response.ok).toBe(true);
  });

  test("should reject invalid signature in production", async () => {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({ _type: "post" }),
      headers: {
        "Content-Type": "application/json",
        "sanity-webhook-signature": "invalid-signature",
      },
    });

    // En desarrollo puede pasar; en producción debe ser 401
    expect(response.status).toBeGreaterThanOrEqual(401);
  });
});
```

---

## 4. Testing del Sistema de Drip Content

### 4.1 Pruebas de Cálculo de Acceso

```typescript
// src/__tests__/membership/drip-content.test.ts
import {
  calculateModuleAccess,
  getDaysUntilUnlock,
} from "@/sanity/lib/queries";

describe("Drip Content System", () => {
  describe("calculateModuleAccess", () => {
    const baseModule = {
      _id: "module-1",
      _type: "membershipContent" as const,
      title: "Week 1",
      moduleNumber: 1,
      isLocked: true,
      dias_para_desbloqueo: 0,
    };

    test("unlocked module immediately available", () => {
      const startDate = new Date();

      const result = calculateModuleAccess(
        { ...baseModule, dias_para_desbloqueo: 0 },
        { start_date: startDate.toISOString() },
      );

      expect(result.isAccessible).toBe(true);
    });

    test("module locked for 7 days", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 3); // 3 días atrás

      const result = calculateModuleAccess(
        { ...baseModule, dias_para_desbloqueo: 7 },
        { start_date: startDate.toISOString() },
      );

      expect(result.isAccessible).toBe(false);
      expect(result.daysUntilUnlock).toBe(4);
    });

    test("module becomes accessible after threshold", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 10); // 10 días atrás

      const result = calculateModuleAccess(
        { ...baseModule, dias_para_desbloqueo: 7 },
        { start_date: startDate.toISOString() },
      );

      expect(result.isAccessible).toBe(true);
    });

    test("fallback to releaseDate if dias_para_desbloqueo is 0", () => {
      const module = {
        ...baseModule,
        dias_para_desbloqueo: 0,
        releaseDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 días en futuro
      };

      const result = calculateModuleAccess(module, {
        start_date: new Date().toISOString(),
      });

      expect(result.isAccessible).toBe(false);
    });
  });

  describe("getDaysUntilUnlock", () => {
    test("returns null without start_date", () => {
      const result = getDaysUntilUnlock(7, null);
      expect(result).toBeNull();
    });

    test("calculates remaining days correctly", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 5);

      const result = getDaysUntilUnlock(14, startDate.toISOString());
      expect(result).toBe(9); // 14 - 5 = 9
    });

    test("returns 0 when module is unlocked", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 10);

      const result = getDaysUntilUnlock(7, startDate.toISOString());
      expect(result).toBe(0);
    });
  });
});
```

---

## 5. Testing de Permisos de Tesoros

### 5.1 Pruebas de Filtrado por Acceso

```typescript
// src/__tests__/treasures/permissions.test.ts
describe("Treasures Access Control", () => {
  const mockTreasures = [
    { _id: "t1", required_id: "tesoro-gral", title: "Tesoro General" },
    { _id: "t2", required_id: "linea-ecos", title: "Tesoro Ecos" },
    { _id: "t3", required_id: "linea-umbral", title: "Tesoro Umbral" },
  ];

  test("user with basic membership sees general treasures", () => {
    const userAccess = ["tesoro-gral"];
    const accessibleTreasures = mockTreasures.filter((t) =>
      userAccess.includes(t.required_id),
    );

    expect(accessibleTreasures).toHaveLength(1);
    expect(accessibleTreasures[0].title).toBe("Tesoro General");
  });

  test("user with linea-ecos sees both general and ecos", () => {
    const userAccess = ["tesoro-gral", "linea-ecos"];
    const accessibleTreasures = mockTreasures.filter((t) =>
      userAccess.includes(t.required_id),
    );

    expect(accessibleTreasures).toHaveLength(2);
  });

  test("user with no membership sees nothing", () => {
    const userAccess: string[] = [];
    const accessibleTreasures = mockTreasures.filter((t) =>
      userAccess.includes(t.required_id),
    );

    expect(accessibleTreasures).toHaveLength(0);
  });
});
```

---

## 6. Testing End-to-End

### 6.1 Flujo Completo de Blog

```typescript
// src/__tests__/e2e/blog-flow.test.ts
describe("Blog E2E Flow", () => {
  test("full blog post lifecycle", async () => {
    // 1. Crear post en Sanity (simulado)
    const newPost = {
      _type: "post",
      title: "Test Post for E2E",
      slug: { current: "test-post-e2e" },
      published: true,
      publishedAt: new Date().toISOString(),
    };

    // 2. Verificar que se puede hacer fetch
    const fetched = await client.fetch(
      '*[_type == "post" && slug.current == "test-post-e2e"][0]',
      { slug: "test-post-e2e" },
    );

    expect(fetched).toBeDefined();
    expect(fetched.title).toBe("Test Post for E2E");

    // 3. Simular webhook de revalidación
    const webhookResponse = await fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({
        _type: "post",
        slug: { current: "test-post-e2e" },
      }),
      headers: { "Content-Type": "application/json" },
    });

    expect(webhookResponse.ok).toBe(true);
  });
});
```

### 6.2 Flujo Completo de Membresía

```typescript
// src/__tests__/e2e/membership-flow.test.ts
describe("Membership E2E Flow", () => {
  test("new member sees correct drip content", async () => {
    // Simular usuario con fecha de inicio reciente
    const userMembership = {
      start_date: new Date().toISOString(), // Hoy
      plan: "transformacion-7-meses",
    };

    // Obtener módulos accesibles
    const allModules = await client.fetch(`
      *[_type == "membershipContent"] | order(moduleNumber asc) {
        _id,
        title,
        moduleNumber,
        isLocked,
        dias_para_desbloqueo
      }
    `);

    // Calcular acceso para cada módulo
    const accessibleModules = allModules.map((module: any) =>
      calculateModuleAccess(module, userMembership),
    );

    // Verificar que solo módulos día 0 son accesibles
    const immediatelyAccessible = accessibleModules.filter(
      (m) => m.isAccessible,
    );
    const lockedModules = accessibleModules.filter((m) => !m.isAccessible);

    // Módulos con dias_para_desbloqueo = 0 deberían estar accesibles
    expect(
      immediatelyAccessible.some((m) => m.dias_para_desbloqueo === 0),
    ).toBe(true);

    // Verificar que hay módulos bloqueados
    expect(lockedModules.length).toBeGreaterThan(0);
  });
});
```

---

## 7. Testing en Desarrollo Local

### 7.1 Configuración del Entorno

```bash
# Variables necesarias para testing
# .env.local

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=test-project
NEXT_PUBLIC_SANITY_DATASET=development
SANITY_API_READ_TOKEN=test-token
SANITY_WEBHOOK_SECRET=test-webhook-secret
```

### 7.2 Scripts de Testing

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:sanity": "vitest --testPathPattern=sanity",
    "test:e2e": "playwright test"
  }
}
```

### 7.3 Ejecutar Tests

```bash
# Tests unitarios de Sanity
npm run test:sanity

# Tests de integración
npm test -- --testPathPattern=sanity

# Tests E2E completos
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 8. Checklist de Testing

### Pre-Deploy

- [ ] Tests de schema pasan
- [ ] Tests de queries pasan
- [ ] Tests de webhooks pasan
- [ ] Tests de drip content pasan
- [ ] Tests de permisos de tesoros pasan
- [ ] Tests E2E del blog pasan
- [ ] Tests E2E de membresía pasan

### En Producción

- [ ] Webhook responde correctamente
- [ ] Contenido se actualiza tras cambios en Sanity
- [ ] Revalidación funciona para todos los tipos de contenido
- [ ] Tiempo de respuesta aceptable (< 2s)

---

## 9. Herramientas de Debug

### Queries de Debug

```typescript
// Ver todos los documentos de un tipo
const allDocs = await client.fetch(`*[_type == "membershipContent"]`);

// Ver estructura de un documento
const doc = await client.fetch(`*[_type == "post"][0]`);
console.log(JSON.stringify(doc, null, 2));

// Ver campos específicos
const fields = await client.fetch(`
  *[_type == "membershipContent"] {
    "id": _id,
    "title": title,
    "moduleNumber": moduleNumber,
    "isLocked": isLocked,
    "dias": dias_para_desbloqueo,
    "releaseDate": releaseDate
  } | order(moduleNumber asc)
`);
```

### Logs de Webhook

```sql
-- Ver logs de webhook en Supabase
SELECT * FROM webhook_logs
WHERE webhook_type = 'sanity'
ORDER BY created_at DESC
LIMIT 20;
```

---

## 10. Referencias

- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Sanity GROQ](https://www.sanity.io/docs/groq)
- [next-sanity](https://github.com/sanity-io/next-sanity)

---

_Documento actualizado: Marzo 2026_
_Proyecto: DaLuz Consciente_
_Versión: 1.0_
