# 📚 Documentación DaLuz - Guía para Guada

> **Proyecto:** DaLuz Consciente - E-commerce de productos naturales y servicios de bienestar  
> **Stack:** Next.js 14, TypeScript, Supabase, Sanity CMS, MercadoPago  
> **Actualizado:** Marzo 2026

---

## 🌐 1. PÁGINAS DE MARKETING (Contenido Público)

### 1.1 Landing Page (/)

**Ubicación:** `src/app/(marketing)/page.tsx`

**Descripción:**

- Página principal del sitio con más de 2000 líneas
- Secciones completas: Hero, Blog, Servicios, Testimonios, Contacto
- Fetch de posts desde Sanity CMS

**Tecnologías:**

- Sanity CMS para contenido dinámico
- SVG Components para backgrounds
- Framer Motion para animaciones

**⚠️ NOTA:** Esta página requiere refactorización por su tamaño (2000+ líneas). Se recomienda extraer secciones a componentes separados.

**Componentes clave:**

- `HeroSection`
- `BlogCard`
- `AnimatedBackground`
- `ContactForm`

---

### 1.2 Blog (/blog)

**Ubicación:** `src/app/(marketing)/blog/`

**Descripción:**

- Listado de artículos desde Sanity CMS
- Sistema de artículos guardados en localStorage
- Búsqueda y filtros

**Rutas:**

- `/blog` - Listado principal
- `/blog/[slug]` - Detalle de artículo
- `/blog/guardados` - Artículos guardados por el usuario

**Componentes clave:**

- `BlogCard` - Tarjeta de artículo
- `BlogShareButtons` - Botones para compartir
- `BlogPageClient` - Componente de listado

**Datos desde Sanity:**

```typescript
// Tipo de post
interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  mainImage?: { asset: { url: string }; alt?: string };
  author: { name: string; image?: { asset: { url: string } } };
  categories?: Array<{ title: string; color?: string }>;
  estimatedReadingTime?: number;
  featured?: boolean;
}
```

---

### 1.3 Alkimya (/alkimya)

**Ubicación:** `src/app/(marketing)/alkimya/`

**Descripción:**

- Marca de cosmética natural de DaLuz
- Página principal de la línea de productos

**Subsecciones:**

- `/alkimya/activos-origen` - Ingredientes y origen
- `/alkimya/biotipos-doshas` - Tipos de piel y doshas
- `/alkimya/tesoros-daluz` - Contenido exclusivo
- `/alkimya/tu-ceremonia` - Rutinas de cuidado
  - `/alkimya/tu-ceremonia/facial`
  - `/alkimya/tu-ceremonia/capilar`
  - `/alkimya/tu-ceremonia/corporal`

**Estilos específicos:**

- `src/styles/alkimya.css` - Estilos personalizados
- `src/styles/biotipos.css` - Estilos de biotipos

---

### 1.4 Servicios Holísticos (/servicios)

**Ubicación:** `src/app/(marketing)/servicios/`

**Rutas disponibles:**

- `/servicios/consultas` - Consultas individuales
- `/servicios/sesiones-holisticas` - Sesiones de bienestar
- `/servicios/talleres` - Talleres grupales
- `/servicios/grupos` - Grupos de práctica
- `/servicios/procesos-integrativos` - Procesos de transformación
- `/servicios/procesos/ciclos-alquimicos` - Ciclos alquímicos
- `/servicios/procesos/sesiones-integrales` - Sesiones integrales

**Componente principal:**

- `ServiceCard` - Tarjeta de servicio

---

### 1.5 Membresía (/membresia)

**Ubicación:** `src/app/(marketing)/membresia/`

**Rutas:**

- `/membresia` - Landing principal
- `/membresia/programa` - Programa de 7 meses
- `/membresia/modulos` - Módulos semanales
- `/membresia/comunidad` - Comunidad de miembros

**Descripción:**

- Programa transformacional de 7 meses
- 28 módulos semanales
- Contenido de Sanity para landing pages

---

### 1.6 Políticas

**Ubicación:** `src/app/(marketing)/politicas/`

**Rutas:**

- `/politicas/privacidad` - Política de privacidad
- `/politicas/terminos` - Términos y condiciones
- `/politicas/arrepentimiento` - Política de arrepentimiento
- `/politicas/envio` - Política de envíos

---

### 1.7 Otras Páginas de Marketing

- `/` - Landing principal
- `/raices` - Historia de DaLuz
- `/filosofia-proposito` - Filosofía y propósito
- `/nuestra-filosofia` - Nuestra filosofía
- `/programa-transformacion` - Programa transformacional
- `/faq` - Preguntas frecuentes
- `/style-tester` - Probador de estilos

---

## 🛒 2. E-COMMERCE (Tienda)

### 2.1 Catálogo (/productos)

**Ubicación:** `src/app/(commerce)/productos/page.tsx`

**Descripción:**

- Grid de productos con filtros
- Sistema de variantes (tamaños, colores)
- Paginación (9 productos por página)
- Búsqueda

**Filtros disponibles:**

- Categoría
- Línea de producto (Alma Terra, Ecos, Jade Ritual, Umbral, Utópica)
- Tipo de piel
- Rango de precio
- Ordenamiento (precio, nombre, reciente)
- Solo disponibles

**Componentes clave:**

- `ProductCard` - Tarjeta de producto
- `ProductGrid` - Grid de productos
- `TiendaHero` - Hero de tienda
- `TiendaSidebar` - Sidebar con filtros
- `FeaturedLineSection` - Sección de líneas destacadas

---

### 2.2 Producto Individual (/productos/[slug])

**Ubicación:** `src/app/(commerce)/productos/[slug]/page.tsx`

**Características:**

- Galería de imágenes
- Selector de variantes
- Información de stock
- Reseñas y ratings
- Productos relacionados

**Tipo de producto:**

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  gallery?: string[];
  category_id: string;
  skin_type: string[];
  benefits: string[];
  inventory_quantity: number;
  is_featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  product_variants?: Array<{
    id: string;
    title: string;
    price: number;
    inventory_quantity: number;
    option1?: string;
    is_default: boolean;
  }>;
}
```

---

### 2.3 Categorías (/categorias/[slug])

**Ubicación:** `src/app/(commerce)/categorias/[slug]/page.tsx`

**Descripción:**

- Productos filtrados por categoría
- Mismo sistema de filtros que /productos

---

### 2.4 Carrito de Compras

**Context:** `src/contexts/CartContext.tsx`

**Características:**

- Persistencia en localStorage (key: `daluz-cart`)
- Gestión de cantidades
- Validación de stock
- Cálculo de totales

**Métodos del Context:**

```typescript
interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  addItem: (item) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}
```

**Componente:**

- `CartSidebar` - Sidebar del carrito

---

## 💳 3. CHECKOUT Y PAGOS

### 3.1 Checkout (/checkout)

**Ubicación:** `src/app/checkout/page.tsx`

**Descripción:**

- Formulario de datos del cliente
- Resumen del carrito
- Integración con MercadoPago
- Validación de stock antes de pagar

**Campos del formulario:**

```typescript
interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
}
```

**Proceso:**

1. Usuario completa formulario
2. Se valida stock de productos
3. Se crea orden en Supabase
4. Se crea preferencia de pago en MercadoPago
5. Usuario es redirigido a MercadoPago
6. Tras pago, webhook actualiza estado de orden

---

### 3.2 API de Checkout

**Ubicación:** `src/app/api/checkout/route.ts`

**Método:** POST

**Función:**

1. Valida autenticación del usuario
2. Valida datos del cliente
3. Crea registro de orden en Supabase
4. Crea ítems de orden
5. Genera preferencia de pago en MercadoPago
6. Retorna preferenceId para iniciar pago

**Configuración de preferencia:**

```typescript
{
  items: [...],
  payer: { name, surname, email },
  back_urls: {
    success: `${origin}/checkout/success`,
    failure: `${origin}/checkout/failure`
  },
  auto_return: 'approved',
  external_reference: order.id, // UUID de la orden
  notification_url: `${origin}/api/webhooks/mercadopago`
}
```

---

### 3.3 Webhook de MercadoPago

**Ubicación:** `src/app/api/webhooks/mercadopago/route.ts`

**Descripción:**

- Recibe notificaciones de pagos de MercadoPago
- Verifica firma de seguridad
- Actualiza estado de orden
- Gestiona inventario
- Envía email de confirmación

**Estados de orden:**

- `pending` - Pago iniciado
- `processing` - Pago en procesamiento
- `completed` - Pago aprobado
- `failed` - Pago fallido

**Seguridad:**

- Verificación de firma con `x-signature` y `x-request-id`
- Secrets configurables en DB (test/production)

**⚠️ NOTA:** Este archivo tiene `@ts-nocheck` y necesita tipado completo.

---

### 3.4 Flujo de Pago

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Checkout  │────▶│  Orden +    │────▶│  Preferencia    │
│   Page      │     │  Items      │     │  MercadoPago    │
└─────────────┘     └─────────────┘     └────────────────┘
                                                │
                                                ▼
                   ┌─────────────┐     ┌─────────────────┐
                   │  /success   │◀────│  Pago en MP     │
                   │  /failure   │     │  Wallet         │
                   └─────────────┘     └─────────────────┘
                           ▲                    │
                           │                    ▼
                    ┌─────────────┐     ┌─────────────────┐
                    │  Orden      │◀────│    Webhook     │
                    │  Actualizada│     │  Actualiza DB  │
                    └─────────────┘     └─────────────────┘
```

---

### 3.5 Tesoros DaLuz

**Descripción:**

- Sistema de contenido digital exclusivo
- Integración con MercadoPago para productos digitales/suscripciones

**APIs:**

- `GET/POST /api/treasures` - Listar/Crear tesoros
- `GET /api/treasures/content` - Contenido de tesoros

**Estado:** En desarrollo

---

## 👤 4. CUENTA DE USUARIO

### 4.1 Autenticación

**Ubicación:** `src/contexts/AuthContext.tsx` y `src/hooks/useAuth.ts`

**Métodos de login:**

- Email y contraseña
- OAuth con Google
- Recuperación de contraseña

**Rutas de auth:**

- `/login` - Inicio de sesión
- `/signup` - Registro
- `/reset-password` - Recuperar contraseña
- `/auth/callback` - Callback de OAuth

**Funcionalidades:**

- Sesión con cookies de Supabase
- Profile automático en registro (trigger `handle_new_user`)
- Actualización de perfil

---

### 4.2 Mi Perfil (/perfil)

**Ubicación:** `src/app/(account)/perfil/page.tsx`

**Descripción:**

- Ver y editar datos del perfil
- Información de cuenta

---

### 4.3 Mis Pedidos (/mis-pedidos)

**Ubicación:** `src/app/(account)/mis-pedidos/page.tsx`

**Descripción:**

- Historial de órdenes del usuario
- Estados: pending, processing, completed, failed

---

### 4.4 Mis Tesoros (/mis-tesoros)

**Ubicación:** `src/app/(account)/mis-tesoros/page.tsx`

**Descripción:**

- Contenido digital adquirido
- Acceso a tesoros

---

### 4.5 Configuración (/configuracion)

**Ubicación:** `src/app/(account)/configuracion/page.tsx`

**Descripción:**

- Preferencias de cuenta
- Notificaciones

---

## 👑 5. ADMIN PANEL

### 5.1 Dashboard (/admin)

**Ubicación:** `src/app/admin/page.tsx`

**Descripción:**

- Vista principal del admin
- KPIs y métricas

**KPIs mostrados:**

- Revenue (actual vs anterior)
- Pedidos (total, pendientes, procesando, completados, fallidos)
- Productos (total, bajo stock, sin stock)
- Clientes (total, nuevos, recurrentes)

**Gráficos:**

- Revenue trend (línea)
- Orders by status (pie)
- Top products (bar)

**Componentes:**

- `KPICard` - Tarjeta de KPI
- `ChartCard` - Tarjeta de gráfico
- `RecentOrdersList` - Pedidos recientes

---

### 5.2 Gestión de Productos (/admin/products)

**Rutas:**

- `/admin/products` - Lista de productos
- `/admin/products/add` - Agregar producto
- `/admin/products/edit/[id]` - Editar producto
- `/admin/products/bulk` - Carga masiva

**Características:**

- CRUD completo de productos
- Gestión de variantes
- Carga de imágenes
- Filtros y búsqueda
- Import/Export JSON

**APIs:**

- `GET/POST /api/admin/products`
- `GET/PUT/DELETE /api/admin/products/[id]`
- `POST /api/admin/products/bulk`
- `POST /api/admin/products/import`

---

### 5.3 Gestión de Pedidos (/admin/orders)

**Rutas:**

- `/admin/orders` - Lista de pedidos
- `/admin/orders/[id]` - Detalle de pedido

**Estados:**

- `pending` - Pendiente de pago
- `processing` - Procesando
- `shipped` - Enviado
- `completed` - Completado
- `failed` - Fallido

**Características:**

- Cambio de estado
- Notificaciones al cliente
- Historial de la orden
- Detalle de ítems

**APIs:**

- `GET/POST /api/admin/orders`
- `GET/PUT /api/admin/orders/[id]`
- `POST /api/admin/orders/[id]/notify`

---

### 5.4 Gestión de Clientes (/admin/customers)

**Rutas:**

- `/admin/customers` - Lista de clientes
- `/admin/customers/[id]` - Perfil del cliente
- `/admin/customers/[id]/edit` - Editar cliente

**Características:**

- Perfil completo del usuario
- Historial de pedidos
- Información de membresía
- Notas del admin

**APIs:**

- `GET/POST /api/admin/customers`
- `GET/PUT /api/admin/customers/[id]`
- `POST /api/admin/customers/search`

---

### 5.5 Gestión de Categorías (/admin/categories)

**Ruta:** `/admin/categories`

**Características:**

- CRUD de categorías
- Slug automático
- Imagen de categoría

---

### 5.6 Reseñas (/admin/reviews)

**Ruta:** `/admin/reviews`

**Descripción:**

- Moderación de reseñas de productos
- Aprobar o rechazar reseñas

**Estados:**

- `pending` - Pendiente de revisión
- `approved` - Aprobada
- `rejected` - Rechazada

**APIs:**

- `GET /api/admin/reviews`
- `POST /api/admin/reviews/[id]/approve`
- `POST /api/admin/reviews/[id]/reject`

---

### 5.7 Sistema de Soporte (/admin/support)

**Rutas:**

- `/admin/support` - Panel de soporte
- `/admin/support/tickets` - Lista de tickets
- `/admin/support/tickets/[id]` - Detalle de ticket
- `/admin/support/tickets/new` - Nuevo ticket
- `/admin/support/templates` - Plantillas de email

**Características:**

- Tickets de soporte
- Conversaciones con clientes
- Plantillas de respuesta

**APIs:**

- `GET/POST /api/admin/support/tickets`
- `GET/PUT /api/admin/support/tickets/[id]`
- `GET/POST /api/admin/support/tickets/[id]/messages`

---

### 5.8 Configuración del Sistema (/admin/system)

**Rutas:**

- `/admin/system` - Configuración general
- `/admin/debug` - Herramientas de debug

**Subsecciones:**

- Configuración de pagos (MercadoPago)
- Configuración de envíos
- SEO del sitio
- Webhooks
- Backups
- Salud del sistema

---

## 📊 6. MEMBRESÍAS

### 6.1 Programa Transformacional

**Descripción:**

- Programa de 7 meses de duración
- 28 módulos semanales
- Contenido de video, ejercicios, reflexiones

**Rutas marketing:**

- `/membresia` - Landing
- `/membresia/programa` - Detalle del programa
- `/membresia/modulos` - Módulos disponibles
- `/membresia/comunidad` - Comunidad

**Ruta de miembro:**

- `/mi-membresia` - Área del miembro

---

### 6.2 Planes

**Planes disponibles:**

- Básico
- Premium

**Características:**

- Acceso a módulos
- Sesiones de coaching
- Kits descargables
- Comunidad

---

### 6.3 Estado Actual

**⚠️ IMPORTANTE - Deuda Técnica:**

1. **Mock Data en producción:**
   - La página `/mi-membresia` tiene `isActive: false` hardcodeado
   - Datos de ejemplo en lugar de datos reales de DB

2. **Integración con MercadoPago Subscriptions:**
   - Pendiente de implementar
   - Webhook para suscripciones no configurado

3. **Acciones necesarias:**
   - Conectar con base de datos de membresías
   - Implementar flujo de suscripción con MP
   - Configurar webhooks para renovaciones

---

## 🔧 7. TECHNOLOGIES & STACK

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript (strict mode)
- **UI:** Shadcn/ui + Tailwind CSS + Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Charts:** Recharts

### Backend

- **Base de datos:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage

### CMS

- **Content:** Sanity Studio
- ** Esquemas:** Posts, productos, membresías, testimonios

### Pagos

- **Pasarela:** MercadoPago Argentina
- **Webhooks:** Notificaciones de pago

### Email

- **Servicio:** Resend
- **Plantillas:** Confirmaciones, soporte

---

## 📝 8. NOTAS IMPORTANTES Y DEUDA TÉCNICA

### 🟡 PENDIENTE DE RESOLVER

1. **Landing Page (>2000 líneas)**
   - Necesita refactorización
   - Extraer componentes: `LandingHeroSection`, `LandingBlogSection`, etc.

2. **Mi-Membresía con Mock Data**
   - `isActive: false` hardcodeado en código
   - No hay conexión real con DB de membresías

3. **MercadoPago Subscriptions**
   - Suscripciones de membresía no implementadas
   - Webhook para renovaciones pendiente

4. **Webhook Tipado**
   - `/api/webhooks/mercadopago` tiene `@ts-nocheck`
   - Necesita tipado completo

---

### ✅ IMPLEMENTADO

1. Sistema completo de e-commerce
2. Checkout con MercadoPago
3. Panel de administración completo
4. Autenticación con Google OAuth
5. Blog con Sanity CMS
6. Sistema de reseñas
7. Sistema de soporte/tickets

---

## 📁 ESTRUCTURA DE ARCHIVOS CLAVE

```
src/
├── app/
│   ├── (marketing)/     # Páginas públicas
│   ├── (commerce)/     # E-commerce
│   ├── (account)/      # Cuenta de usuario
│   ├── (auth)/         # Autenticación
│   ├── admin/          # Panel admin
│   ├── checkout/       # Checkout
│   └── api/            # APIs
├── components/
│   ├── ui/             # Componentes base
│   ├── ui/brand/       # Componentes de marca
│   ├── admin/          # Componentes admin
│   └── commerce/       # Componentes e-commerce
├── contexts/           # React Contexts
├── hooks/              # Custom Hooks
├── lib/
│   ├── supabase.ts     # Cliente Supabase
│   ├── mercadopago/    # Config MP
│   ├── email/          # Envío de emails
│   └── sanity/         # Cliente Sanity
└── types/              # Tipos TypeScript
```

---

## 🔗 ENLACES ÚTILES

- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Sanity Studio:** http://localhost:3000/studio
- **Supabase Dashboard:** https://supabase.com/dashboard

---

_Documentación creada en Marzo 2026_
_Para actualizaciones, revisar el código fuente_
