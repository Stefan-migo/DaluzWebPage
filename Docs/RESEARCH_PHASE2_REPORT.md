# Research & Analytics - Phase 2 Report

## Resumen Ejecutivo

Phase 2 de la infraestructura de analytics y experimentación de DaLuz Consciente ha sido completada. Esta fase incluye herramientas de A/B testing, tracking avanzado de e-commerce, y documentación para configuración de herramientas de terceros.

**Estado**: ✅ Completada
**Costo**: $0 (usando herramientas gratuitas)
**Fecha**: Marzo 2026

---

## 📦 Entregables de Phase 2

### 1. Sistema de A/B Testing

#### Hook `useABTest` (`src/hooks/useABTest.ts`)

- Asignación determinística de variantes para consistencia de usuario
- Persistencia en localStorage
- Tracking de vistas y conversiones
- Soporte para testing forzado (debug)

**Uso:**

```tsx
const { variant, isControl, trackConversion } = useABTest({
  experimentName: "guest_checkout",
  defaultVariant: "control",
});

return isControl ? <CheckoutConLogin /> : <GuestCheckout />;
```

#### Tablas de Base de Datos

- `ab_test_configs`: Configuración de experimentos activos
- `ab_test_assignments`: Registro de asignaciones por usuario
- Vista `ab_test_results`: Resultados agregados

#### API `/api/admin/ab-tests`

- GET: Listar experimentos con resultados
- POST: Crear nuevo experimento

---

### 2. Tracking de E-commerce Avanzado

#### Hook `usePurchaseTracking` (`src/hooks/usePurchaseTracking.ts`)

- Dispara eventos de purchase a Supabase, GA4 y FB Pixel
- Limpia el carrito después de tracking exitoso
- Previene double tracking

#### Eventos Implementados

| Evento             | Descripción               | Destino                   |
| ------------------ | ------------------------- | ------------------------- |
| `purchase`         | Compra completada         | Supabase + GA4 + FB Pixel |
| `checkout_start`   | Inicio de checkout        | Supabase + GA4 + FB Pixel |
| `view_cart`        | Visualización del carrito | Supabase + GA4            |
| `add_to_cart`      | Añadir al carrito         | CartContext ya implementa |
| `remove_from_cart` | Remover del carrito       | CartContext ya implementa |

#### Página de Success Integrada

La página `/checkout/success` ahora:

1. Obtiene detalles del pedido
2. Dispara eventos de purchase a GA4 y FB Pixel
3. Limpia el carrito
4. Envía email de confirmación

---

### 3. Guía de Configuración de Analytics

**Archivo**: `Docs/ANALYTICS_SETUP_GUIDE.md`

Contenido:

1. Configuración paso a paso de Google Analytics 4
2. Configuración paso a paso de Facebook Pixel
3. Configuración de webhook de MercadoPago
4. Configuración de UTMs
5. Verificación y troubleshooting
6. Checklist final

---

## 🔧 Cambios Técnicos

### Nuevos Archivos

```
src/hooks/useABTest.ts              # Hook de A/B testing
src/hooks/usePurchaseTracking.ts    # Hook de tracking de purchases
src/app/api/admin/ab-tests/route.ts # API de experimentos
Docs/ANALYTICS_SETUP_GUIDE.md      # Guía de configuración
```

### Archivos Modificados

```
src/app/checkout/success/page.tsx   # Integración de tracking
src/types/database.ts              # Tipos para A/B testing
supabase/migrations/              # Nuevas migraciones de A/B
```

### Nuevas Migraciones

```
supabase/migrations/20260324000000_create_analytics_system.sql
  - Tabla analytics_events
  - Tabla research_metrics
  - Función track_event()
  - Políticas RLS

supabase/migrations/20260324000001_add_ab_testing_functions.sql
  - Función track_ab_experiment()
  - Tabla ab_test_configs
  - Tabla ab_test_assignments
  - Vista ab_test_results
  - Función assign_user_to_experiment()
```

---

## 📊 Benchmarks Implementados

### Dashboard de Funnel

En `/admin/analytics` → Pestaña "Funnel":

| Métrica           | DaLuz (Estimado) | Industria  |
| ----------------- | ---------------- | ---------- |
| Conversión Global | 1.8%             | 2.5%       |
| Abandono Carrito  | 68%              | 65-75%     |
| Abandono Checkout | 35%              | 20-30%     |
| Ticket Promedio   | $35 USD          | $45-60 USD |

### Eventos de Tracking Configurados

- ✅ page_view
- ✅ product_view
- ✅ add_to_cart
- ✅ remove_from_cart
- ✅ view_cart
- ✅ checkout_start
- ✅ purchase
- ✅ signup

---

## 🎯 Próximas Hipótesis (Recomendadas)

Basado en el análisis de Phase 1, las hipótesis prioritarias son:

### 1. Guest Checkout (RICE: 50)

**Hipótesis**: Si implementamos guest checkout (email opcional sin cuenta), la conversión de checkout aumentará +25%.

**Métricas a trackear**: checkout_completion_rate

### 2. Trust Signals (RICE: 35)

**Hipótesis**: Si agregamos badges de SSL, teléfono y chat WhatsApp visibles en checkout, el abandono disminuirá +10%.

**Métricas a trackear**: checkout_abandonment_rate

### 3. Urgency/Escasez (RICE: 450)

**Hipótesis**: Si mostramos "¡Solo quedan X!" en productos con stock bajo, la conversión de product_page a add_to_cart aumentará +15%.

**Métricas a trackear**: product_page_cta_click_rate

---

## 💰 Costo Total del Proyecto

| Fase                               | Costo  | Notas                        |
| ---------------------------------- | ------ | ---------------------------- |
| Phase 1 (Analytics Infrastructure) | $0     | Usa Supabase + código propio |
| Phase 2 (A/B Testing + Tracking)   | $0     | Usa código propio            |
| **Total**                          | **$0** |                              |

### Alternativas de Pago (Opcionales)

- PostHog Cloud: $20+/mes (analytics completo + session replay)
- Hotjar: $32+/mes (heatmaps + session replay)
- Amplitude: $0-100/mes (product analytics avanzado)

---

## 📋 Checklist de Implementación

- [x] Migraciones de base de datos ejecutadas
- [x] Hook useAnalytics implementado
- [x] Hook useABTest implementado
- [x] Hook usePurchaseTracking implementado
- [x] Tracking en CartContext integrado
- [x] Página de success con tracking de purchase
- [x] Dashboard de funnel en admin
- [x] API de A/B tests
- [x] Guía de configuración GA4/FB Pixel

---

## 🧪 Cómo Empezar

### 1. Ejecutar Migraciones

```bash
npx supabase db push
```

### 2. Configurar Variables de Entorno

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
```

### 3. Verificar Tracking

1. Instalar GA4 DebugView extension
2. Instalar Meta Pixel Helper extension
3. Realizar acciones de prueba en el sitio
4. Verificar eventos en los debuggers

### 4. Crear Primer Experimento

1. Ir a `/admin/analytics`
2. Ir a pestaña "Funnel"
3. Usar la API `/api/admin/ab-tests` para crear experimento
4. Implementar variante usando `useABTest` hook

---

## 📞 Recursos

- [GA4 Documentation](https://support.google.com/analytics/)
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [MercadoPago Webhooks](https://www.mercadopago.com.ar/developers/es/docs/notifications/webhooks/webhooks)
- [A/B Testing Best Practices](https://exp-platform.com/abtesting/)

---

_Documento preparado por Research Specialist_
_Proyecto: DaLuz Consciente_
_Fecha: Marzo 2026_
