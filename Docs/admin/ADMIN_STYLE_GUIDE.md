# Guía de Estilos - Admin DaLuz

## Paleta de Colores - Fuente: Cliente

### Colores Extraídos de Imagen

| Nombre         | HEX     | RGB             | Uso Propuesto       |
| -------------- | ------- | --------------- | ------------------- |
| Blanco Puro    | #FFFFFF | (255, 255, 255) | Fondo de contenido  |
| Rojo Sangre    | #8B0000 | (139, 0, 0)     | Sidebar / Header    |
| Burdeos Oscuro | #6A1111 | (106, 17, 17)   | Sidebar hover       |
| Marrón Rojizo  | #4A0D0D | (74, 13, 13)    | Sidebar activo      |
| Crema Beige    | #FDF3E3 | (253, 243, 227) | Fondos alternativos |
| Azul Noche     | #0A1230 | (10, 18, 48)    | -                   |
| Verde Bosque   | #0F2B1F | (15, 43, 31)    | -                   |
| Azul Acero     | #1D3F6A | (29, 63, 106)   | Énfasis / Links     |

### Colores de Especificaciones

| Nombre              | HEX     | Uso                     |
| ------------------- | ------- | ----------------------- |
| Azul Raíces         | #051341 | Blog/Raíces             |
| Beige Procesos      | #FFF2DB | Fondos Procesos         |
| Verde Alkimya       | #285D30 | Alkimya                 |
| Rojo Alkimya/Tienda | #791010 | Textos en fondos beige  |
| Naranja Alkimya     | #FF4E21 | Énfasis                 |
| Beige Texto         | #FFF4E0 | Texto en fondos oscuros |

---

## Mapeo Admin - Variables CSS

### Variables Implementadas en globals.css

```css
:root {
  /* Sidebar y Header */
  --admin-bg-primary: #ffffff; /* Blanco Puro - Fondo contenido */
  --admin-bg-secondary: #8b0000; /* Rojo Sangre - Sidebar/Header */
  --admin-bg-tertiary: #fdf3e3; /* Crema Beige - Fondos alternativos */

  /* Sidebar States */
  --admin-sidebar-hover: #6a1111; /* Burdeos Oscuro - Hover */
  --admin-sidebar-active: #4a0d0d; /* Marrón Rojizo - Activo */

  /* Bordes */
  --admin-border-primary: #fdf3e3; /* Crema */
  --admin-border-secondary: #8b000020; /* Rojo con opacidad */

  /* Texto */
  --admin-text-primary: #4a0d0d; /* Marrón Rojizo - Texto principal */
  --admin-text-secondary: #6a1111; /* Burdeos Oscuro - Texto secundario */
  --admin-text-tertiary: #8b000080; /* Rojo con opacidad - Texto muted */
  --admin-text-inverse: #fdf3e3; /* Crema - Texto en fondos oscuros */

  /* Acentos */
  --admin-accent-primary: #fdf3e3; /* Crema - Acentos claros */
  --admin-accent-secondary: #6a1111; /* Burdeos Oscuro - Acentos oscuros */
  --admin-accent-tertiary: #ff4e21; /* Naranja Alkimya - Énfasis */

  /* Estados */
  --admin-success: #285d30; /* Verde Alkimya */
  --admin-warning: #ff4e21; /* Naranja Alkimya */
  --admin-error: #8b0000; /* Rojo Sangre */
  --admin-info: #1d3f6a; /* Azul Acero */
}
```

---

## Aplicación por Componente

### 1. Sidebar

- **Fondo:** `--admin-bg-secondary` (#8B0000)
- **Items normales:** Texto crema (#FDF3E3) con opacidad 0.85
- **Items hover:** Fondo burdeos (#6A1111)
- **Items activo:** Fondo marrón rojizo (#4A0D0D) + borde izquierdo naranja

### 2. Header

- **Fondo:** `--admin-bg-secondary` (#8B0000)
- **Título:** Texto crema (#FDF3E3)
- **Usuario:** Texto crema con opacidad

### 3. Contenido

- **Fondo principal:** Blanco (#FFFFFF)
- **Fondo alternativo:** Crema (#FDF3E3) para cards
- **Cards:** Borde rojo con opacidad, sombra sutil

### 4. KPIs y Métricas

- **Valor principal:** `#4A0D0D` (Marrón Rojizo)
- **Label:** `#6A1111` (Burdeos)
- **Iconos:** `#6A1111` (Burdeos)

---

## Archivos Modificados

### CSS

- `src/app/globals.css` - Variables CSS del admin

### Componentes

- `src/app/admin/layout.tsx` - Sidebar y Header
- `src/app/admin/page.tsx` - Dashboard
- `src/components/admin/dashboard/KPICard.tsx` - Con drill-down
- `src/components/admin/dashboard/ChartCard.tsx`
- `src/components/admin/dashboard/RecentOrdersList.tsx` - Navegación a pedidos
- `src/components/admin/dashboard/QuickActions.tsx` - Acciones mejoradas

---

## Funcionalidad Drill-Down

### KPIs Clickeables

| KPI               | Navegación                       |
| ----------------- | -------------------------------- |
| Ingresos del Mes  | `/admin/orders?filter=completed` |
| Pedidos           | `/admin/orders`                  |
| Productos Activos | `/admin/products`                |
| Clientes          | `/admin/customers`               |

### RecentOrdersList

- Cada pedido es clickeable → `/admin/orders?id={order_id}`
- "Ver todos" navega a `/admin/orders`

### QuickActions

- Nuevo Producto → `/admin/products/add`
- Pedidos → `/admin/orders`
- Stock Bajo → `/admin/products?filter=low_stock`
- Analíticas → `/admin/analytics`
- Productos con stock bajo → `/admin/products/edit/{id}`

---

## Checklist de Implementación

- [x] Actualizar variables CSS en `globals.css`
- [x] Verificar contraste WCAG para texto
- [x] Aplicar a layout admin (sidebar, header, content)
- [x] Aplicar a componentes del dashboard (KPICard, ChartCard, etc.)
- [x] Drill-down a KPIs
- [x] Navegación en RecentOrdersList
- [x] QuickActions funcionales
- [ ] Verificar componentes compartidos (botones, badges, tablas)
- [ ] Testing en mobile/responsive

---

## Notas

- La paleta está inspirada en tonos tierra y colores naturales de DaLuz
- El rojo burdeos es coherente con la marca (Alkimya/Tienda)
- El crema/beige proporciona calidez manteniendo profesionalismo
- Evitar usar colores genéricos (gray-500, etc.) en admin

---

## Página de Pedidos (/admin/orders)

### Mejoras Implementadas

#### Header

- Título y descripción con colores del sistema
- Botones con estilos coherentes
- Responsive design

#### Filtros y Búsqueda

- Campo de búsqueda con icono
- Filtro por estado con indicadores de color
- Contador de resultados

#### Tabla

- Headers con fondo crema
- Filas alternadas (blanco/crema)
- Badges de estado en la tabla
- Números de pedido en color burdeos
- Montos en verde

#### Paginación

- Diseño responsive
- Botones "Anterior" y "Siguiente" con flechas
- Números de página con estilos activos

---

## Mejoras Recientes

### Header del Admin

- Gradiente de fondo (rojo burdeos)
- Avatar con iniciales del usuario
- Badge de notificaciones naranjas
- Botones de acción con estilos coherentes

### Dashboard

- KPIs clickeables con navegación
- RecentOrdersList con layout horizontal
- Badges de estado estilo "pill"
- Gráficos con colores del sistema

### Pedidos

- Tabla con filas alternadas
- Filtros mejorados
- Paginación responsive

---

## Mejoras de Gráficos Implementadas

### Gráfico de Línea (Ingresos)

- Tooltip mejorado con formato de fecha completo
- Estilos de axis usando variables CSS
- Mayor tamaño de punto activo
- Bordes en axis para mejor visibilidad

### Gráfico Circular (Estado de Pedidos)

- Porcentaje en etiquetas
- Tooltip mejorado
- Leyenda vertical
- Bordes en segmentos

### Gráfico de Barras (Productos)

- Formato de eje Y en miles
- Barras con bordes redondeados
- Tooltip mejorado

---

## Badges de Estado Actualizados

### Estados de Pedido

| Estado     | Color             |
| ---------- | ----------------- |
| Completado | Verde (#285D30)   |
| Pendiente  | Naranja (#FF4E21) |
| Procesando | Azul (#1D3F6A)    |
| Enviado    | Azul (#1D3F6A)    |
| Cancelado  | Gris              |
| Fallido    | Rojo (#8B0000)    |

### Estados de Pago

| Estado      | Color             |
| ----------- | ----------------- |
| Pagado      | Verde (#285D30)   |
| Pendiente   | Naranja (#FF4E21) |
| Fallido     | Rojo (#8B0000)    |
| Reembolsado | Gris              |
