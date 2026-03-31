# Contexto para Continuar el Trabajo del Admin

## Resumen del Proyecto

Se ha estado mejorando la sección de administración (`/admin`) de DaLuz para:

1. Implementar un sistema de colores coherente basado en la paleta del cliente
2. Mejorar la funcionalidad y usabilidad del dashboard y tablas

---

## Paleta de Colores Implementada

### Variables CSS en `src/app/globals.css`

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

## Archivos Modificados

### 1. CSS Global

- **`src/app/globals.css`**
  - Variables CSS del admin
  - Estilos del header, sidebar, cards
  - Clases para badges y componentes

### 2. Layout Admin

- **`src/app/admin/layout.tsx`**
  - Header con gradiente, avatar de usuario con iniciales
  - Sidebar con estilos del sistema
  - Notificaciones mejoradas

### 3. Dashboard (`/admin`)

- **`src/app/admin/page.tsx`**
  - KPIs clickeables con navegación
  - Gráficos con colores del sistema
  - Tooltips mejorados
  - Stock alerts

### 4. Componentes del Dashboard

- **`src/components/admin/dashboard/KPICard.tsx`** - drill-down
- **`src/components/admin/dashboard/ChartCard.tsx`**
- **`src/components/admin/dashboard/RecentOrdersList.tsx`** - layout horizontal, badges estilo pill
- **`src/components/admin/dashboard/QuickActions.tsx`**

### 5. Página de Pedidos (`/admin/orders`)

- **`src/app/admin/orders/page.tsx`**
  - Filtros mejorados con indicadores de color
  - Tabla con filas alternadas
  - Paginación responsive
- **`src/components/admin/orders/OrderTable.tsx`**
  - Selectores de estado/pago con badges y flecha
  - Colores con mayor contraste
  - Estilos del sistema

### 6. Otros Componentes

- **`src/components/admin/AdminNotificationDropdown.tsx`**
- **`src/components/admin/orders/OrderDetailDialog.tsx`** (tiene error TS pendiente)

### 7. Página de Clientes (`/admin/customers`)

- **`src/app/admin/customers/page.tsx`**
  - Header con estilos del sistema
  - Stats cards con iconos y colores coherentes
  - Filtros con Selectores estilizados
  - Tabla con estilos de colores coherentes
  - Badges de estado con el sistema de colores
  - Botones de acciones con estilos coherentes
  - Paginación estilizada

### 8. Formularios de Clientes (`/admin/customers/new` y `/admin/customers/[id]/edit`)

- **`src/app/admin/customers/new/page.tsx`**
  - Header con variables CSS del sistema
  - Cards con bordes y estilos del sistema
  - Inputs y selects con estilos coherentes
  - Botones con colores del sistema
  - Estados de error estilizados

- **`src/app/admin/customers/[id]/edit/page.tsx`**
  - Estados de carga/error con estilos del sistema
  - Header con variables CSS
  - Cards con bordes correctos
  - Inputs y selects estilizados
  - Botones con colores coherentes

### 9. Página de Administradores (`/admin/admin-users`)

- **`src/app/admin/admin-users/page.tsx`**
  - Header con variables CSS del sistema
  - Stats cards con iconos y colores coherentes
  - Filtros con Selectores estilizados
  - Autocomplete con estilos del sistema
  - Tabla con filas alternadas y estilos de colores
  - Badges de rol y estado con el sistema de colores
  - Dropdown de acciones estilizado
  - Estados de loading/error coherentes
  - Dialog de creación estilizado

### 10. Página de Sistema (`/admin/system`)

- **`src/app/admin/system/page.tsx`**
  - Header con variables CSS del sistema (text-primary/secondary)
  - Tarjetas de estado del sistema con iconos coherentes
  - Tabs con estilos del sistema
  - Tarjetas de métricas con colores del admin
  - Configuraciones con estilos de etiquetas
  - Botones de acciones rápidas estilizados
  - Diálogos de mantenimiento con estilos coherentes
  - Lista de backups con información estructurada
  - Estados de loading/error con estilos del sistema
  - Reemplazados todos los colores del theme principal por variables CSS del admin

---

## Estado de Mejoras por Página

| Página                       | Estado        | Notas                            |
| ---------------------------- | ------------- | -------------------------------- |
| `/admin` (Dashboard)         | ✅ Completado | KPIs, gráficos, acciones rápidas |
| `/admin/orders`              | ✅ Completado | Filtros, tabla, paginación       |
| `/admin/customers`           | ✅ Completado | Stats, filtros, tabla, badges    |
| `/admin/customers/new`       | ✅ Completado | Formulario crear estilizado      |
| `/admin/customers/[id]/edit` | ✅ Completado | Formulario editar estilizado     |
| `/admin/reviews`             | ✅ Completado | Filtros, tabla, badges           |
| `/admin/admin-users`         | ✅ Completado | Stats, filtros, tabla, badges    |
| `/admin/system`              | ✅ Completado | Config, salud, mantenimiento     |
| `/admin/products`            | ⚠️ Pendiente  | Por hacer                        |
| `/admin/categories`          | ⚠️ Pendiente  | Por hacer                        |
| OrderDetailDialog.tsx        | ⚠️ Pendiente  | Error TS sin resolver            |

---

## Errores TypeScript Pendientes

Los siguientes errores existen pero no fueron corregidos:

```
src/components/admin/orders/OrderDetailDialog.tsx(91,16): error TS18048: 'order.order_items' is possibly 'undefined'.
```

Este error aparece porque `order.order_items` puede ser undefined. Se necesita agregar un check defensivo.

---

## Para Continuar el Trabajo

### Página Actual: `/admin/system`

La página de sistema ahora tiene:

- Header con variables CSS del sistema (text-primary/secondary)
- Tarjetas de estado del sistema con iconos coherentes
- Tabs con estilos del sistema (Resumen, Configuración, Pagos, Email, Envíos, SEO, Webhooks, Salud, Mantenimiento)
- Tarjetas de métricas con colores del admin
- Configuraciones organizadas por categorías con estilos de etiquetas
- Botones de acciones rápidas estilizados
- Diálogos de mantenimiento con estilos coherentes
- Lista de backups con información estructurada
- Estados de loading/error con estilos del sistema
- Todos los colores del theme principal reemplazados por variables CSS del admin

### Siguientes Tareas Sugeridas

1. **Corregir error TypeScript** en OrderDetailDialog.tsx
2. **Aplicar mismos cambios** a `/admin/products` (tabla de productos)
3. **Mejorar página de categorías** `/admin/categories`
4. **Testing completo** de todas las páginas admin

### Cómo Aplicar el Estilo

Para aplicar el sistema de colores a nuevos componentes:

```tsx
// Ejemplo de badge de estado
<span
  className="inline-flex items-center gap-1.5 text-xs font-medium"
  style={{ color: "var(--admin-success)" }}
>
  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--admin-success)" }} />
  Completado
</span>

// Ejemplo de card
<Card className="admin-card" style={{ border: "1px solid var(--admin-border-secondary)" }}>
  <CardContent>...</CardContent>
</Card>

// Ejemplo de botón
<Button style={{ backgroundColor: "var(--admin-bg-secondary)", color: "white" }}>
  Guardar
</Button>
```

### Documentación de Estilos

Existe en: `Docs/admin/ADMIN_STYLE_GUIDE.md`

---

## Instrucciones para el Próximo Agente

1. **Leer este documento** de contexto primero
2. **Revisar la paleta** de colores en `globals.css`
3. **Continuar aplicando** el sistema de colores a las páginas restantes
4. **Mantener consistencia** con los estilos ya implementados
5. **Probar cambios** en el navegador antes de dar por terminado

El objetivo es que TODO el admin tenga una apariencia coherente con la paleta de DaLuz (rojo burdeos, crema, verde, naranja).
