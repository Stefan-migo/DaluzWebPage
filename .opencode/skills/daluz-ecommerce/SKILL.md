---
name: daluz-ecommerce
description: Guía para desarrollar el módulo E-commerce de DA LUZ: productos, categorías, carrito. Usar al modificar ProductCard, ProductGrid, CartSidebar, TiendaSidebar, CartContext, APIs de products/categories, o páginas de productos y categorías.
---

# E-commerce - Guía de Desarrollo

## Alcance

Catálogo, productos, variantes, categorías, carrito. **No incluye checkout ni pagos** (módulo 02).

---

## Reglas de Código

### Convenciones

- **ProductCard**: Recibir `id`, `slug` (cuando disponible), `name`, `price`, `imageUrl`, `stock`, `category`, `lineTheme`.
- **Links a producto**: Usar `/productos/${slug}` cuando exista slug; fallback a `/productos/${id}`.
- **addItem**: Siempre pasar `productId`, `variantId` (o undefined), `name`, `price`, `image`, `stock`, `size`, `sku`, `quantity`.
- **CartItem id**: Formato `productId-variantId` o `productId-default`.

### Patrones a seguir

1. **Agregar al carrito**:
   ```ts
   const defaultVariant = product.product_variants?.find(v => v.is_default) || product.product_variants?.[0];
   addItem({
     productId: product.id,
     variantId: defaultVariant?.id,
     name: product.name,
     price: defaultVariant?.price || product.price,
     originalPrice: product.compare_at_price,
     image: product.featured_image,
     stock: defaultVariant?.inventory_quantity ?? product.inventory_quantity,
     size: defaultVariant?.option1,
     sku: product.slug,
     quantity,
   });
   ```

2. **Filtros en API products**: `category`, `search`, `skin_type`, `min_price`, `max_price`, `sort_by`, `sort_order`, `page`, `limit`, `in_stock`.

3. **Líneas de producto**: IDs `alma-terra`, `ecos`, `jade-ritual`, `umbral`, `utopica`. Slugs categoría: `linea-{id}`.

### Anti-patrones a evitar

- No usar `window.location.href` para navegación interna; usar `<Link>`.
- No pasar solo `id` a ProductCard para links; preferir `slug` para SEO.
- No omitir `stock` en addItem; el carrito valida cantidad vs stock.
- No crear lógica duplicada de addItem; extraer a hook si se repite.

---

## Arquitectura

### CartContext

- **Estado**: `items`, `total`, `itemCount`, `isOpen`.
- **Acciones**: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `setCartOpen`.
- **Persistencia**: `localStorage` key `daluz-cart`.
- **ID ítem**: `productId-variantId` o `productId-default`.

### Productos y variantes

- **products**: `inventory_quantity` (stock producto sin variantes).
- **product_variants**: `inventory_quantity` por variante; `option1` (ej. tamaño).
- **Relación**: 1 producto → N variantes. Si hay variantes, usar stock de variante.

### Líneas y theming

- **ThemeContext**: `applyGlobalTheme(theme)` aplica CSS vars y clase body.
- **ProductCard**: `lineTheme` prop activa paleta (alma-terra, ecos, jade-ritual, umbral, utopica, default).
- **Categorías**: Slug `linea-{id}` debe existir en tabla `categories` para que TiendaSidebar funcione.

---

## Mejores Prácticas

### Performance

- Imágenes con `next/image`; `remotePatterns` en next.config para Supabase Storage.
- Listados: paginación (9 por defecto); evitar cargar >50 productos sin paginación.
- `React.memo` en ProductCard si hay listas grandes.

### Seguridad

- APIs públicas: `createClient` (respeta RLS). Admin: `createServiceRoleClient`.
- RLS en `products`, `product_variants`, `categories`, `cart_items`.
- Validar `category_id` como UUID en APIs.

### Mantenibilidad

- Componentes < 200 líneas; extraer subcomponentes o hooks.
- Tipos explícitos: `CartItem`, `Product`, `Category`; evitar `any`.
- Interfaces de Product repetidas: considerar `src/types/ecommerce.ts`.

### Accesibilidad

- ProductCard: `alt` en imágenes, labels en botones cantidad.
- CartSidebar: `aria-label` en botones +/-, focus visible.
- Links "Ver producto" con texto descriptivo.

---

## Refactorización

### Cuándo refactorizar

- Página detalle > 400 líneas → extraer `useProductDetail`, `ProductGallery`, `RelatedProducts`.
- Lógica addItem repetida en 3+ sitios → hook `useAddToCart(product)`.
- ProductGrid no usado → evaluar eliminación o integración con /productos.

### Cómo refactorizar sin romper

1. **Carrito**: No cambiar estructura `CartItem`; añadir campos opcionales si hace falta.
2. **ProductCard**: Mantener props actuales; añadir `slug` como opcional.
3. **APIs**: Mantener query params existentes; añadir nuevos sin eliminar viejos.

---

## Checklist Pre-Commit

- [ ] `npm run lint` pasa
- [ ] `npm run type-check` pasa
- [ ] Si se modificó addItem o CartContext: probar agregar, actualizar cantidad, eliminar
- [ ] Si se modificó ProductCard: verificar en /productos, /categorias/[slug], detalle
- [ ] Si se modificó API products: verificar filtros y paginación
- [ ] Si se modificaron categorías: verificar slugs `linea-{id}`

---

## Referencias

- **Docs del módulo**: `Docs/modules/01-ecommerce/MODULE.md`
- **Overview**: `Docs/PROJECT_OVERVIEW.md`
- **Design system**: `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md`
- **Skill global**: `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
