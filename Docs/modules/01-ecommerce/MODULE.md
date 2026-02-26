# E-commerce - Documentación del Módulo

**Módulo:** 01 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo E-commerce cubre la experiencia de compra desde la navegación hasta el punto de checkout:

- **Catálogo de productos**: Listado, búsqueda, filtrado y ordenamiento
- **Detalle de producto**: Información completa, variantes, reseñas, productos relacionados
- **Navegación por categorías**: Productos por categoría y por línea (Alma Terra, Ecos, Jade, Umbral, Utópica)
- **Carrito de compras**: Agregar, modificar cantidad, eliminar ítems, persistencia entre sesiones

### 1.2 Objetivos de negocio

- Mostrar el catálogo de biocosmética artesanal de forma atractiva y filtrable
- Permitir descubrir productos por línea de producto y tipo de piel
- Facilitar la agregación al carrito sin fricción
- Mantener el carrito en el navegador entre sesiones (localStorage)

### 1.3 Objetivos técnicos

- APIs REST coherentes para productos y categorías
- Componentes reutilizables con theming por línea de producto
- Estado del carrito centralizado con Context API
- Persistencia del carrito en localStorage

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/productos` | `src/app/(commerce)/productos/page.tsx` | Listado de productos con filtros, búsqueda, paginación |
| `/productos/[slug]` | `src/app/(commerce)/productos/[slug]/page.tsx` | Detalle de producto con variantes, reseñas, relacionados |
| `/categorias/[slug]` | `src/app/(commerce)/categorias/[slug]/page.tsx` | Productos por categoría con theming por línea |
| Layout | `src/app/(commerce)/layout.tsx` | Header + Footer para toda la sección commerce |

---

### 2.2 APIs (endpoints)

#### Publicas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listado paginado con filtros (category, search, skin_type, price, sort) |
| GET | `/api/products/[id]` | Producto por ID (admin puede ver archived) |
| GET | `/api/products/by-slug/[slug]` | Producto por slug |
| GET | `/api/products/[id]/reviews` | Reseñas de un producto |
| GET | `/api/categories` | Todas las categorías |
| GET | `/api/categories/by-slug/[slug]` | Categoría por slug |

#### Admin (fuera del alcance directo)

- `src/app/api/admin/products/*` - CRUD, búsqueda, bulk, importación

---

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `products` | Catálogo principal (nombre, slug, precio, inventario, categoría, etc.) |
| `product_variants` | Variantes (tamaño, aroma, precio, stock por variante) |
| `categories` | Categorías con jerarquía (parent_id), slug, imagen |
| `cart_items` | Carrito (user_id o session_id para anónimos) |
| `reviews` | Reseñas de productos (aprobadas por moderación) |

---

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| ProductCard | `src/components/ui/brand/ProductCard.tsx` | Tarjeta de producto con variantes, favoritos, add to cart |
| ProductGrid | `src/components/ui/brand/ProductGrid.tsx` | Grid con filtros y ordenamiento (client-side) |
| CartSidebar | `src/components/commerce/CartSidebar.tsx` | Sheet lateral del carrito con resumen y envío gratis |
| TiendaSidebar | `src/components/commerce/TiendaSidebar.tsx` | Filtros de tienda (categorías, piel, precio, orden) |
| FeaturedLineSection | `src/components/commerce/FeaturedLineSection.tsx` | Sección de línea destacada al final de /productos |
| TiendaHero | `src/components/commerce/TiendaHero.tsx` | Hero de la página de productos |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo principal

```
Navegación → Listado (/productos) → Filtros → Detalle (/productos/[slug]) → Agregar al carrito → CartSidebar
```

1. **Listado**: `/productos` usa `TiendaSidebar` + grid de `ProductCard`. Datos vía `GET /api/products` con filtros en query params.
2. **Detalle**: `/productos/[slug]` obtiene producto por `GET /api/products/by-slug/[slug]` (fallback a ID si 404).
3. **Agregar al carrito**: `addItem()` del `CartContext` con `productId`, `variantId`, `name`, `price`, `image`, `stock`, `size`, `sku`.
4. **Carrito**: `CartSidebar` muestra ítems, permite cantidad, eliminar, vaciar. Link a `/checkout`.

### 3.2 Dependencias

```
CartContext     → Estado del carrito (add, remove, update, persistencia localStorage)
ThemeContext   → Paletas por línea (Alma Terra, Ecos, Jade, Umbral, Utópica)
AuthContext    → Usuario actual (para reseñas, favoritos)
LikeContext    → Favoritos en ProductCard
Supabase       → API usa createClient (server) o createServiceRoleClient según ruta
```

### 3.3 Integración con líneas de producto

| Línea | ID | Slug categoría | Paleta |
|-------|-----|----------------|--------|
| Alma Terra | alma-terra | linea-alma-terra | #9B201A |
| Ecos | ecos | linea-ecos | #12406F |
| Jade Ritual | jade-ritual | linea-jade-ritual | #04412D |
| Umbral | umbral | linea-umbral | #EA4F12 |
| Utópica | utopica | linea-utopica | #392E13 |

- **TiendaSidebar**: Líneas de producto redirigen a `/categorias/linea-{id}` (ej. `/categorias/linea-alma-terra`).
- **ProductCard**: Prop `lineTheme` aplica colores según línea.
- **Categoría**: `/categorias/[slug]` detecta slug y aplica `getLineThemeFromSlug()` para colores.
- **Producto relacionado**: `determineProductLine()` busca en nombre, descripción, categoría.

---

## 4. Fortalezas

| Área | Fortaleza |
|------|-----------|
| **CartContext** | Reducer limpio, tipos explícitos, persistencia localStorage, validación de stock |
| **APIs** | Paginación, filtros (category, search, skin_type, price), sort, in_stock |
| **ProductCard** | Variantes de diseño (elegant, artisanal), lineTheme, LikeContext, cantidad selector |
| **TiendaSidebar** | Colapsable, filtros, líneas de producto, categorías DB |
| **Product detail** | Variantes, galería, reseñas, productos relacionados, theming por línea |
| **RLS** | products, product_variants, categories, cart_items con políticas definidas |
| **Migraciones** | Schema bien definido, índices, triggers updated_at |

---

## 5. Debilidades y Deuda Técnica

### 5.1 Problemas detectados

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **ProductCard usa ID en links** | `/productos/${id}` | URLs no SEO-friendly; debería usar slug |
| **ProductCard no recibe slug** | Páginas pasan `id` | Falta pasar `slug` desde ProductCard props |
| **Inconsistencia skin_type** | productos/page.tsx vs skinTypes | UI usa "seca", "grasa" pero API usa "dry", "oily" |
| **sortBy en productos** | sortOptions | `name_asc`/`name_desc` en Select pero API espera `name` |
| **TiendaSidebar** | product lines | `window.location.href` hard reload; debería usar `Link` |
| **product_variants** | DB | Campo `inventory_quantity` vs `stock` en otras migraciones |
| **products** | DB | `inventory_quantity` y `stock_quantity` coexisten (PROJECT_OVERVIEW) |

### 5.2 Código que necesita refactorización

| Archivo | Líneas | Problema |
|---------|--------|----------|
| `productos/[slug]/page.tsx` | ~1100 | Muy largo; extraer lógica de línea, reseñas, galería |
| `productos/page.tsx` | ~450 | ProductosContent muy grande; extraer hooks |
| `ProductCard.tsx` | ~390 | Cerca del límite; considerar extraer subcomponentes |

### 5.3 Inconsistencias

- **inventory_quantity vs stock_quantity**: products usa `inventory_quantity`; product_variants usa `inventory_quantity` en migración original. Otras migraciones mencionan `stock`.
- **Categorías**: TiendaSidebar asume slugs `linea-{id}`; categorías en DB pueden tener slugs distintos.
- **Producto relacionado**: Filtrado por texto en nombre/descripción/categoría; no hay relación explícita producto-línea.

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **ProductCard: usar slug en links**  
   - Pasar `slug` a ProductCard desde listados y detalle.
   - Cambiar `href` a `/productos/${slug}`.

2. **Sincronizar skin_type UI/API**  
   - Unificar valores: UI (seca, grasa, etc.) ↔ API (dry, oily, etc.).
   - Documentar mapeo en un solo lugar.

3. **Validar stock en tiempo real**  
   - El carrito usa stock al agregar; considerar revalidar stock antes de checkout.

### 6.2 Prioridad media

4. **Refactorizar página de detalle**  
   - Extraer: `useProductDetail`, `ProductGallery`, `ProductReviews`, `RelatedProducts`.

5. **TiendaSidebar: usar Link**  
   - Reemplazar `window.location.href` por `<Link href={...}>` para SPA.

6. **ProductGrid: uso actual**  
   - ProductGrid no se usa en /productos; TiendaSidebar + grid manual. Evaluar si unificar.

7. **Unificar inventario**  
   - Migración para consolidar `inventory_quantity`/`stock_quantity` en products y product_variants.

### 6.3 Prioridad baja

8. **React Query/SWR**  
   - Reemplazar `useEffect` + `fetch` por caché y revalidación.

9. **Virtualización**  
   - Para listados muy grandes (>100 productos), considerar virtualización.

10. **Accesibilidad**  
    - Revisar `aria-*` en CartSidebar, ProductCard, selector de cantidad.

---

## 7. Planes en Curso / Roadmap

- **Migración decrease_product_stock**: Resolver conflicto de firmas (PROJECT_OVERVIEW 6.1).
- **Documentación modular**: Este documento es el primero de 12 módulos.
- **NotebookLM**: Subir documentación para consultas con IA.

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios

| Cambio | Pasos |
|--------|-------|
| **Productos** | 1) Revisar API `/api/products` 2) Tipos en interfaces 3) ProductCard/ProductGrid |
| **Categorías** | 1) API `/api/categories` 2) TiendaSidebar slugs 3) Categoría page theming |
| **Carrito** | 1) CartContext 2) CartSidebar 3) addItem en páginas 4) localStorage |

### 8.2 Puntos de atención

- **addItem**: Siempre incluir `productId`, `variantId` (si hay variantes), `stock`, `name`, `price`, `image`, `sku`.
- **Carrito ID**: `id = productId-variantId` o `productId-default`.
- **Stock**: No permitir cantidad > stock; CartContext ya limita en `updateQuantity` y `addItem`.
- **Líneas**: Paletas en `productLines` (TiendaSidebar, FeaturedLineSection, ThemeContext) deben coincidir.

### 8.3 Checklist antes de hacer cambios

- [ ] ¿El cambio afecta al carrito? Verificar CartContext y tipos CartItem.
- [ ] ¿Se añaden nuevos filtros? Revisar API products y TiendaSidebar.
- [ ] ¿Se modifica ProductCard? Verificar props en todas las páginas que lo usan.
- [ ] ¿Se tocan categorías? Verificar slugs `linea-{id}` y categorías en DB.
- [ ] `npm run lint` y `npm run type-check` pasan antes de commit.

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` - Secciones 3 (Base de datos), 4 (Sistema E-commerce)
- `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` - ProductCard, ProductGrid, paletas
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` - Guía global del proyecto
