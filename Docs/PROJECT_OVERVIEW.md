# DA LUZ CONSCIENTE - PROJECT OVERVIEW
## Documentación Base del Sistema E-commerce y Administración

**Versión:** 1.0  
**Última actualización:** Febrero 2025  
**Repositorio:** https://github.com/Stefan-migo/DaluzWebPage.git

---

## 1. VISIÓN DEL PROYECTO

### 1.1 Propósito
**DA LUZ CONSCIENTE** es una plataforma unificada de e-commerce y administración para biocosmética artesanal natural. Presenta "Alkimyas para alma y cuerpo" combinando:

- **ALKIMYA DA LUZ**: E-commerce de productos biocosmecéticos artesanales
- **DA LUZ ALKIMYA CONSCIENTE**: Servicios holísticos y programa transformacional de 7 meses
- **Experiencia unificada**: Productos y servicios integrados en una sola plataforma

### 1.2 Filosofía de Diseño
- **Artesanía**: Estética de calidad elaborada a mano
- **Consciencia**: Navegación burgundy/rojo con fondos crema cálidos
- **Botánica**: Materiales naturales, follaje estacional, imágenes florales
- **Conexión espiritual**: Elementos mandala, valores de vida consciente
- **Contexto cultural**: Tipografía y contenido optimizados para español

### 1.3 Flujo de Trabajo del Equipo
- **Base de datos local**: Supabase en Docker para pruebas
- **Estrategia de migraciones**: Probar TODAS las migraciones localmente primero
- **Producción**: Solo después de validación local, push a base de datos remota
- **Colaboración**: Trabajo en equipo vía GitHub

---

## 2. ARQUITECTURA TÉCNICA

### 2.1 Stack Tecnológico
```
Frontend:     Next.js 14 + TypeScript + App Router
UI:           Shadcn/ui + Tailwind CSS + Radix UI
Estilos:      CSS-in-JS con theming dinámico
Estado:       React Context API (Auth, Cart, Theme, Like)
Animación:    Framer Motion + animaciones CSS personalizadas
Backend:      Supabase (PostgreSQL, Auth, Storage)
CMS:          Sanity Studio
Pagos:        MercadoPago Argentina (100% implementado)
Email:        Resend
Hosting:      Vercel
```

### 2.2 Estructura de Rutas (App Router)
```
src/app/
├── (marketing)/     # Landing, blog, about, filosofía
├── (commerce)/      # Productos, carrito, checkout
├── (account)/       # Dashboard usuario, perfil, pedidos
├── (auth)/          # Login, signup, reset password
├── (servicios)/     # Servicios holísticos
├── (membresia)/     # Programa de 7 meses
├── admin/           # Panel de administración
└── api/             # API Routes
```

### 2.3 Estructura de Componentes
```
src/components/
├── ui/              # Shadcn base + componentes brand
│   └── brand/       # HeroSection, ProductCard, BlogCard, etc.
├── admin/           # Componentes específicos admin
├── commerce/        # CartSidebar, TiendaSidebar, etc.
├── layout/          # Header, MainLayout, Footer
└── contexts/        # AuthContext, CartContext, LikeContext
```

---

## 3. BASE DE DATOS (Supabase/PostgreSQL)

### 3.1 Tablas Principales
| Tabla | Propósito |
|-------|-----------|
| `profiles` | Perfiles de usuario (extiende auth.users) |
| `products` | Catálogo de productos biocosmecéticos |
| `product_variants` | Variantes (tamaño, aroma, etc.) |
| `categories` | Categorías de productos |
| `orders` | Pedidos con integración MercadoPago |
| `order_items` | Ítems de cada pedido |
| `cart_items` | Carrito (usuario o sesión anónima) |
| `reviews` | Reseñas de productos |
| `stock_movements` | Auditoría de movimientos de inventario |
| `admin_users` | Usuarios administradores |
| `admin_notifications` | Notificaciones del sistema |

### 3.2 Campos de Inventario (IMPORTANTE)
El sistema tiene **dualidad de campos** por compatibilidad histórica:
- `inventory_quantity` - Campo original en products
- `stock_quantity` - Añadido para funciones de inventario
- `product_variants.stock` - Stock por variante

### 3.3 Funciones Críticas
- `decrease_product_stock(product_id UUID, quantity INTEGER)` - 2 params, productos directos
- `decrease_product_stock(p_product_id, p_variant_id, p_quantity)` - 3 params, variantes
- `is_admin(user_id UUID)` - Verificación de permisos admin

---

## 4. SISTEMA E-COMMERCE

### 4.1 Flujo de Compra
1. Navegación → Productos por categoría/línea
2. Carrito → Context API, persistencia por sesión
3. Checkout → MercadoPago preference creation
4. Webhook → Procesamiento de pago aprobado
5. Inventario → decrease_product_stock al confirmar pago

### 4.2 Integración MercadoPago
- Preferencias creadas en checkout
- Webhook en `/api/webhooks/mercadopago/route.ts`
- Actualización de orden + inventario en pago aprobado
- Moneda: ARS (Argentina)

### 4.3 Líneas de Producto (Theming)
- ALMA TERRA (tonos tierra)
- ECOS (azules océano)
- JADE RITUAL (verdes bosque)
- UMBRAL (naranjas atardecer)
- UTÓPICA (dorado tierra)

---

## 5. SISTEMA ADMIN

### 5.1 Autenticación Admin
- RPC `is_admin(user_id)` verifica contra `admin_users`
- Email `daluzalkimya@gmail.com` configurado como admin
- Layout con redirect a `/` si no es admin
- Debug mode: `localStorage.setItem('admin-debug', 'true')`

### 5.2 Módulos Admin
| Ruta | Función |
|------|---------|
| `/admin` | Dashboard con KPIs |
| `/admin/orders` | Gestión de pedidos |
| `/admin/products` | Catálogo e inventario |
| `/admin/categories` | Categorías |
| `/admin/reviews` | Moderación reseñas |
| `/admin/customers` | Gestión clientes |
| `/admin/analytics` | Reportes y estadísticas |
| `/admin/support` | Tickets y soporte |
| `/admin/admin-users` | Usuarios administradores |
| `/admin/system` | Configuración del sistema |

### 5.3 Notificaciones
- Nuevos pedidos
- Stock bajo (≤5 unidades)
- Nuevas reseñas
- Reseñas reportadas

---

## 6. ESTADO ACTUAL Y MEJORAS IDENTIFICADAS

### 6.1 ⚠️ BLOQUEANTE: Error de Migración
**Problema:** `supabase start` falla en migración `20250815000000_add_inventory_functions.sql`

```
ERROR: function name "decrease_product_stock" is not unique (SQLSTATE 42725)
```

**Causa:** Múltiples migraciones crean versiones sobrecargadas de `decrease_product_stock`:
- `20250220000001`: `(p_product_id, p_variant_id, p_quantity)` - variantes
- `20250815000000`: `(product_id, quantity)` - productos directos
- `20250815230204`: `(product_id, quantity)` - compatibilidad MP

**Solución aplicada:** Se modificó `20250815000000_add_inventory_functions.sql`:
1. Añadido `ADD COLUMN IF NOT EXISTS stock_quantity` para asegurar que existe antes del CREATE FUNCTION
2. Añadido `DROP FUNCTION IF EXISTS decrease_product_stock(UUID, INTEGER)` para idempotencia
3. El GRANT con firma completa `(UUID, INTEGER)` debe funcionar correctamente

**Verificar:** Ejecutar `npx supabase db reset` con Docker Desktop corriendo.

### 6.2 Mejoras de Código
| Área | Mejora | Prioridad |
|------|--------|-----------|
| **database.ts** | Tipos desactualizados vs schema real (products tiene más campos) | Media |
| **Webhook MP** | ~~Fallback de inventario usa `supabase.raw` incorrectamente~~ ✅ Corregido: ahora usa fetch + update | - |
| **stock_movements** | Schema inconsistente: 20250220 usa variant_id, 20250815 no | Media |
| **product_variants** | Campo `stock` vs `inventory_quantity` - unificar | Media |

### 6.3 Mejoras de Arquitectura
| Área | Mejora | Prioridad |
|------|--------|-----------|
| **Contextos** | Considerar React Query/SWR para datos remotos | Baja |
| **API** | Middleware de validación centralizado | Media |
| **Tests** | Añadir tests E2E para flujo checkout | Alta |
| **Seguridad** | Revisar RLS en todas las tablas críticas | Alta |

### 6.4 Mejoras de UX/UI
| Área | Mejora | Prioridad |
|------|--------|-----------|
| **Responsive** | Verificar breakpoints en admin mobile | Media |
| **Accesibilidad** | Auditoría WCAG 2.1 AA | Media |
| **Loading** | Skeletons consistentes en toda la app | Baja |

### 6.5 Documentación Existente
- `UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` - Sistema de diseño completo (incl. especificaciones oficiales Feb 2025)
- `Docs/modules/00-frontend-ui/MODULE.md` - Módulo Frontend/UI
- `COMPLETION_SUMMARY_AUGUST_2025.md` - Estado admin
- `MercadoPagoImplementationPlan.md` - Integración pagos
- Múltiples guías en `/Docs`

---

## 7. VARIABLES DE ENTORNO

Ver `env.example` para lista completa. Críticas:
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADOPAGO_ACCESS_TOKEN` / `MERCADOPAGO_WEBHOOK_SECRET`
- `RESEND_API_KEY` para emails
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` para OAuth

Para local: descomentar bloque SUPABASE LOCAL en env.example.

---

## 8. COMANDOS CLAVE

```bash
# Desarrollo
npm run dev

# Supabase local
npx supabase start
npx supabase status    # Ver credenciales
npx supabase db reset # Reset completo

# Build
npm run build
npm run type-check
npm run lint
```

---

## 9. PRÓXIMOS PASOS SUGERIDOS

1. **Inmediato:** Resolver migración `decrease_product_stock` para poder levantar DB local
2. **Corto plazo:** Corregir fallback de inventario en webhook MercadoPago
3. **Medio plazo:** Sincronizar `src/types/database.ts` con schema real
4. **Largo plazo:** Documentación modular por módulo (products, orders, etc.)

---

## 10. NOTEBOOKLM - CEREBRO DEL PROYECTO

**NotebookLM es el centro de documentación y conocimiento del proyecto.** Toda la documentación debe estar allí para consultas con IA.

### Subir esta documentación

Ver guía completa en `Docs/NOTEBOOKLM_SETUP.md`. Resumen:

```bash
# 1. Auth (si no está hecha)
nlm login --manual --file cookies.json --profile daluz

# 2. Crear notebook
nlm notebook create "DA LUZ Project" --profile daluz

# 3. Obtener ID y añadir overview
nlm notebook list --profile daluz
nlm source add <NOTEBOOK_ID> --file Docs/PROJECT_OVERVIEW.md --profile daluz --wait --title "Project Overview"
```

### Script de ayuda

```bash
bash scripts/upload-docs-to-notebooklm.sh
```

---

*Este documento es la base para toda la documentación futura del sistema. Se irá ampliando con documentación específica por módulo. Mantener sincronizado con NotebookLM.*
