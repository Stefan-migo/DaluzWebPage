---
name: daluz-ecommerce-admin
description: Guidelines for building DA LUZ CONSCIENTE e-commerce and admin system. Use when implementing features, refactoring, or reviewing code for this natural cosmetics e-commerce platform. Enforces clean code, best practices, and domain-specific patterns.
---

# DA LUZ E-commerce & Admin - Development Guidelines

## Quick Reference

**Project:** Biocosmética artesanal e-commerce + admin  
**Stack:** Next.js 14, Supabase, MercadoPago, Sanity  
**Docs base:** `Docs/PROJECT_OVERVIEW.md`

---

## 1. Estructura y Organización

### Rutas y Módulos
- `(marketing)` → Landing, blog, filosofía
- `(commerce)` → Tienda, carrito, checkout
- `(account)` → Perfil, pedidos del usuario
- `admin` → Panel administración (requiere `is_admin`)
- `api` → Rutas API, webhooks

### Convenciones de Archivos
- Componentes: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase con prefijo `use` (`useAuth.ts`)
- Utilidades: camelCase (`lib/utils.ts`)
- Sin extensiones en imports, usar alias `@/`

### Límites de Tamaño
- Componentes React: < 200 líneas (extraer si supera)
- Servicios/API: < 250 líneas
- Archivos > 150 líneas: planificar extracción

---

## 2. Base de Datos y Migraciones

### Regla de Oro
**SIEMPRE probar migraciones localmente primero** (`npx supabase start` → `npx supabase db reset`)

### Funciones Sobrecargadas
Evitar múltiples versiones de la misma función. Si existe `decrease_product_stock(UUID, INTEGER)`, no crear otra con firma distinta sin consolidar.

### Inventario - Campos
- `products.inventory_quantity` y `products.stock_quantity` coexisten (compatibilidad)
- `product_variants` usa `stock` o `inventory_quantity` según migración
- RPC `decrease_product_stock(product_id, quantity)` para productos sin variantes

### RLS
- Todas las tablas sensibles deben tener RLS habilitado
- Políticas admin: verificar `profiles.membership_tier = 'admin'` o `admin_users`

---

## 3. E-commerce

### Flujo de Compra
1. Carrito → `CartContext`
2. Checkout → Crear MercadoPago preference
3. Webhook → Actualizar orden + `decrease_product_stock`

### MercadoPago
- Webhook en `/api/webhooks/mercadopago/route.ts`
- Validar firma con `MERCADOPAGO_WEBHOOK_SECRET`
- En pago aprobado: actualizar `orders`, llamar RPC inventario

### Fallback de Inventario
Si RPC falla, NO usar `supabase.raw` (no existe). Alternativas:
- Reintentar RPC
- Fetch producto → decrementar en app → update con valor calculado

---

## 4. Admin

### Autenticación
- RPC `is_admin(user_id)` antes de renderizar
- Redirect a `/` si no admin
- Debug: `localStorage.setItem('admin-debug', 'true')`

### Patrones Admin
- Datos en tiempo real: fetch desde API `/api/admin/*`
- Loading states en todas las operaciones async
- Manejo de errores con mensajes claros al usuario

---

## 5. UI/UX y Diseño

### Sistema de Diseño
Ver `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` y `Docs/modules/00-frontend-ui/MODULE.md`

### Jerarquía Tipográfica (Especificación Oficial)
- `font-display` (Malisha) → Logo, heroes
- `font-title` (VELISTA) → H1, H2
- `font-subtitle` (Playfair Italic) → H3, destacados
- `font-text` (EB Garamond/Times) → Body, párrafos (mín 18px)
- `font-caption` (Inter) → Labels, captions

### Paleta
- Primario: `#AE0000` (burgundy)
- Texto principal: `#601010` (Bordó Profundo - oficial)
- Fondos: `#F0EACE`, `#FFF4B3`

### Líneas de Producto
Cada línea tiene paleta propia (Alma Terra, Ecos, Jade, Umbral, Utópica).

---

## 6. Código Limpio

### Principios
- **DRY**: Buscar código existente antes de crear nuevo (Gap Analysis)
- **KISS**: Lógica sencilla y efectiva
- **Single Responsibility**: Un componente, una responsabilidad

### TypeScript
- Tipos explícitos en props y retornos de funciones
- Evitar `any`; usar `unknown` si necesario
- Sincronizar `src/types/database.ts` con schema Supabase

### Performance
- `React.memo()` para componentes con animaciones o listas grandes
- Code splitting en rutas pesadas
- Imágenes con `next/image` y `remotePatterns` configurados

---

## 7. Seguridad

- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente
- Validar inputs en API routes (Zod recomendado)
- Sanitizar datos antes de renderizar (XSS)
- Headers de seguridad en `next.config.js` (ya configurados)

---

## 8. Testing y Validación

Antes de commit:
```bash
npm run lint
npm run type-check
npm run build
```

Para migraciones:
```bash
npx supabase db reset
```

---

## 9. Recursos

- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **UI/UX:** `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`
- **MercadoPago:** `Docs/MercadoPagoImplementationPlan.md`
- **Supabase local:** `Docs/QUICK_START_LOCAL_SUPABASE.md`
