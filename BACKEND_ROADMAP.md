# 🗺️ Hoja de Ruta: Reestructuración Backend (DaluzWebPage)

Este documento detalla el plan maestro para transformar el backend de Daluz en una arquitectura de nivel profesional, segura y escalable basada en **Clean Architecture**.

---

## 🏛️ Patrón de Arquitectura (3 Capas)

Para maximizar el orden y la testeabilidad, dividimos el código en:

1.  **Capa de Handler (`src/app/api/.../route.ts`)**: Habla HTTP. Valida parámetros, auth y devuelve la Response.
2.  **Capa de Service (`src/lib/services/`)**: Habla Lógica de Negocio. Orquestra entre APIs externas (MercadoPago), envíos de email y múltiples repositorios.
3.  **Capa de Repository (`src/lib/repositories/`)**: Habla Base de Datos. Consultas SQL/Supabase puras sin lógica de negocio.

---

## ✅ Etapa 1: Seguridad y Middleware (Completada)
- [x] **Middleware Centralizado**: Implementación de `requireAdmin()` para proteger todas las rutas `/api/admin/*`.
- [x] **Validación de Sesión**: Migración de validación ad-hoc a una lógica basada en el servidor.

## ✅ Etapa 2: Herramientas de Diagnóstico (Completada)
- [x] **Suite de Diagnóstico v2.0**: Panel en `/admin/diagnostics` para testing manual.
- [x] **Ciclo de Vida de Productos**: Endpoint `/api/admin/products/[id]` individualizado.

## ✅ Etapa 3: Sistema de Pagos Robusto (Completada)
- [x] **Fix Idempotencia**: Clave dinámica por orden.
- [x] **Transacciones Seguras**: Rollbacks automáticos en fallas de MercadoPago o items.
- [x] **Tipado de Webhooks**: Eliminación de `@ts-nocheck` y contratos definidos con interfaces.

---

## 🏗️ Etapa 4: Service & Repository Layer (En Progreso)

### Fase 1: Extracción de Servicios (Completada por Antigravity)
- [x] `checkout.service.ts`: Orquestación de pago y creación de orden.
- [x] `webhook.service.ts`: Lógica post-venta (inventario, tesoros, emails).
- [x] `orders.service.ts`: Lógica administrativa de órdenes.

### Fase 2: Administración General (Pendiente - Asignado a Claude Code)
- [ ] **Migración a Repositorios**: Crear `src/lib/repositories/` y mover las queries de los servicios actuales a archivos tipo `orders.repository.ts`.
- [ ] `backups.service.ts`: Dumping y restauración de BD (~770 líneas en `admin/system/backups`).
- [ ] `support.service.ts`: Gestión de tickets y analytics (`admin/support/tickets`).
- [ ] `customer.service.ts`: Perfiles e historial de compras (`admin/customers`).
- [ ] `product.service.ts`: Gestión de stock complejo y variantes.

---

## 🚀 Etapa 5: Infraestructura e Integridad (Siguiente)
- [ ] **Global Error Handler**: Wrapper para estandarizar respuestas de error.
- [ ] **Logging Centralizado**: Logger que persista errores críticos en tabla `system_logs`.
- [ ] **Validación de Esquemas (Zod)**: Validar payloads antes de procesarlos.
- [ ] **Caching**: Implementar `unstable_cache` en rutas de alta demanda.

---

## 🌟 Etapa 6: Optimización de UX y SEO (Final)
- [ ] **SEO Dinámico**: Servicio para generar Meta Tags desde el servidor.
- [ ] **Real-time Notifications**: Alerts instantáneas para el admin vía Supabase Realtime.

---

## 🛠️ Comandos de Mantenimiento
- **Type Check**: `npx tsc --noEmit`
- **Diagnóstico**: Visitar `/admin/diagnostics` para pruebas de integración.
