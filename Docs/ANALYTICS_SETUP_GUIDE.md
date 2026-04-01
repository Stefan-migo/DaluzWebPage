# Guía de Configuración - Analytics (GA4 + Facebook Pixel)

## 🎯 Objetivo

Configurar el tracking de Google Analytics 4 y Facebook Pixel para DaLuz Consciente.

---

## 📋 Prerequisites

- Acceso a Google Analytics (GA4)
- Acceso a Facebook Business Suite
- Acceso al panel de hosting (.env variables)

---

## 1. Google Analytics 4 (GA4)

### Paso 1.1: Crear propiedad GA4

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Click en **"Admin"** (rueda dentada)
4. En la columna "Account", selecciona tu cuenta o crea una nueva
5. En la columna "Property", click en **"Create Property"**
6. Completa:
   - **Name**: `DaLuz Consciente`
   - **Reporting timezone**: `Argentina (GMT-3)`
   - **Currency**: `Argentine Peso (ARS)`
7. Click **"Next"** y completa la información de negocio
8. Click **"Create"**

### Paso 1.2: Obtener Measurement ID

1. En tu propiedad GA4, ve a **"Data Streams"**
2. Click en **"Add stream"** → **"Web"**
3. Completa:
   - **Website URL**: `https://daluzconsciente.com`
   - **Stream name**: `DaLuz Web`
4. Click **"Create stream"**
5. Copia el **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Paso 1.3: Configurar eventos recomendados

En GA4 Admin → **"Events"** → **"Create conversion"**:

| Event Name       | Trigger    |
| ---------------- | ---------- |
| `purchase`       | 完成购买   |
| `add_to_cart`    | 加入购物车 |
| `checkout_start` | 开始结账   |
| `view_cart`      | 查看购物车 |
| `signup`         | 完成注册   |

### Paso 1.4: Configurar e-commerce enhanced

1. Ve a **"Admin"** → **"Data Streams"** → tu stream web
2. Click en **"Enhanced measurement"**
3. Activa:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Site search
   - ❌ Outbound clicks (opcional)
   - ❌ Site search (si tienes search interno)
   - ✅ Video engagement (opcional)
   - ❌ File downloads (opcional)

---

## 2. Facebook Pixel

### Paso 2.1: Crear Pixel en Meta Business Suite

1. Ve a [Meta Business Suite](https://business.facebook.com/)
2. Ve a **"All tools"** → **"Events Manager"**
3. Click **"Connect Data Sources"** → **"Web"** → **"Meta Pixel"**
4. Click **"Create a Meta Pixel"**
5. Ingresa el nombre: `DaLuz Pixel`
6. Ingresa tu website URL: `https://daluzconsciente.com`
7. Click **"Create Pixel"**

### Paso 2.2: Obtener Pixel ID

1. En tu Pixel, ve a **"Settings"**
2. Copia el **Pixel ID** (número de 15-16 dígitos)

### Paso 2.3: Instalar Pixel (si no usas el código automático)

Si prefieres instalar manualmente:

1. En Events Manager → tu Pixel
2. Click **"Overview"** → **"Install code"**
3. Copia el código base:

```html
<!-- Meta Pixel Code -->
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  fbq("init", "TU_PIXEL_ID_AQUI");
  fbq("track", "PageView");
</script>
<!-- End Meta Pixel Code -->
```

### Paso 2.4: Configurar Standard Events

En Events Manager → **"Add Events"** → **"From your website"**

| Standard Event     | Trigger                      |
| ------------------ | ---------------------------- |
| `Purchase`         | `/checkout/success` page     |
| `AddToCart`        | Click en "Añadir al carrito" |
| `InitiateCheckout` | Checkout page                |
| `ViewContent`      | Product page                 |
| `Lead`             | Signup completion            |

### Paso 2.5: Configurar Conversiones de Purchase

1. Ve a **"Events Manager"** → tu Pixel
2. Click **"Add Events"** → **"Use webhooks"**
3. Para MercadoPago, configurarás el webhook directamente (ver sección de abajo)

---

## 3. Configurar Variables de Entorno

### Paso 3.1: Obtener valores

Ya deberías tener:

- ✅ **GA4 Measurement ID**: `G-XXXXXXXXXX`
- ✅ **Facebook Pixel ID**: `XXXXXXXXXXXXXXX`

### Paso 3.2: Actualizar .env.local

```bash
# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
```

### Paso 3.3: Para producción (Vercel)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto DaLuz
3. Ve a **Settings** → **Environment Variables**
4. Agrega las mismas variables

---

## 4. Configurar Webhook de MercadoPago (Purchase Events)

### Paso 4.1: Obtener tokens de MercadoPago

1. Ve a [MercadoPago Developer](https://developers.mercadopago.com/)
2. Accede a tu cuenta de MercadoPago
3. Ve a **Credenciales** → **Credenciales de prueba/producción**

### Paso 4.2: Configurar webhook en MercadoPago

1. En tu cuenta MercadoPago, ve a **"Mis integraciones"** → **"Webhooks"**
2. URL de notificación: `https://daluzconsciente.com/api/webhooks/mercadopago`
3. Selecciona los eventos a recibir:
   - ✅ `payment.created`
   - ✅ `payment.updated`

### Paso 4.3: Verificar que el webhook actual procesa purchases

El webhook existente en `src/app/api/webhooks/mercadopago/route.ts` ya está configurado para guardar en `webhook_logs`.

Para asegurar que GA4/FB Pixel reciban los eventos de purchase, el webhook debería disparar los eventos.

---

## 5. Configuración de UTMs (Opcional pero Recomendado)

### Paso 5.1: Crear plantilla de UTMs

Para campañas de marketing, usa esta estructura:

```
https://daluzconsciente.com/productos?
utm_source=instagram&utm_medium=social&utm_campaign=navidad_2024
```

| Parámetro      | Descripción                     | Ejemplos                                |
| -------------- | ------------------------------- | --------------------------------------- |
| `utm_source`   | Origen de tráfico               | google, instagram, facebook, newsletter |
| `utm_medium`   | Medio                           | cpc, social, email, referral            |
| `utm_campaign` | Nombre de campaña               | navidad_2024, lanzamiento_jade          |
| `utm_term`     | Keywords (opcional)             | aceite-argan, serum-jade                |
| `utm_content`  | Contenido específico (opcional) | banner-1, cta-2                         |

### Paso 5.2: Verificar que UTMs se capturan

El código de tracking ya incluye:

- Captura de UTMs desde URL
- Almacenamiento en sessionStorage
- Envío con eventos de purchase

Para verificar:

1. Abre Chrome DevTools → Network
2. Ve a tu sitio con UTMs: `?utm_source=test&utm_medium=test`
3. En console, ejecuta: `sessionStorage.getItem('daluz_utm_params')`
4. Deberías ver: `{"utm_source":"test","utm_medium":"test"}`

---

## 6. Verificar Configuración

### Paso 6.1: Test con GA4 DebugView

1. Instala [GA4 DebugView Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/fgmbmjpeonpalkpchdaepdnhjpnenobh) en Chrome
2. Ve a tu sitio y realiza acciones de prueba
3. En GA4 Admin → **DebugView** → Verifica los eventos

### Paso 6.2: Test con Meta Pixel Helper

1. Instala [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fckkpcnncjnnpgafljacalhjhheagfag) en Chrome
2. Ve a tu sitio y realiza acciones de prueba
3. Verifica que el Pixel detecta los eventos

### Paso 6.3: Event Builder Test

GA4:

1. Admin → **DebugView**
2. Usa el **Event Builder** para simular eventos

Facebook:

1. Events Manager → tu Pixel → **Test Events**
2. Ingresa tu URL y click **"Open Website"**

---

## 7. Troubleshooting

### GA4 no recibe datos

1. Verifica que el Measurement ID sea correcto
2. Verifica que el código esté en todas las páginas
3. Usa GA4 DebugView para ver errores
4. Verifica que no haya bloqueadores de tracking (AdBlock, Ghostery)

### Facebook Pixel no dispara

1. Verifica que el Pixel ID sea correcto
2. Verifica que `fbq` esté definido: `window.fbq` en console
3. Usa Meta Pixel Helper para ver errores específicos
4. Verifica que el dominio esté autorizado en Pixel settings

### UTMs no se capturan

1. Revisa que la URL tenga parámetros正确 (sin espacios, encoding correcto)
2. Verifica que `sessionStorage` esté habilitado (no en modo privado bloqueado)
3. El código de tracking extrae UTMs al cargar la página, no después

---

## 8. Configuración Sugerida por País

### Argentina (MercadoPago)

Para tracks de purchase en Argentina con MercadoPago:

1. Configurar webhook de MercadoPago para notificar purchases
2. El webhook handler ya está en `/api/webhooks/mercadopago`
3. Para enviar eventos a GA4/FB desde webhook, agregar lógica:

```typescript
// En webhook handler, después de confirmar payment
if (payment.status === "approved") {
  // GA4 Purchase event
  gtag("event", "purchase", {
    transaction_id: payment.id,
    value: payment.transaction_amount,
    currency: "ARS",
    items: orderItems,
  });

  // FB Pixel Purchase event
  fbq("track", "Purchase", {
    value: payment.transaction_amount,
    currency: "ARS",
  });
}
```

---

## 9. Checklist Final

- [ ] Measurement ID de GA4 configurado en `.env.local`
- [ ] Pixel ID de Facebook configurado en `.env.local`
- [ ] GA4 DebugView muestra eventos de prueba
- [ ] Meta Pixel Helper muestra eventos de prueba
- [ ] UTMs se capturan correctamente
- [ ] Webhook de MercadoPago configurado para purchases
- [ ] Eventos de conversión marcados en GA4
- [ ] Eventos estándar configurados en Meta Pixel

---

## 📞 Recursos

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Facebook Pixel Setup](https://www.facebook.com/business/help/952192354843755)
- [GA4 Enhanced Ecommerce](https://support.google.com/analytics/answer/1037249)
- [MercadoPago Webhooks](https://www.mercadopago.com.ar/developers/es/docs/notifications/webhooks/webhooks)

---

_Documento preparado por Research Specialist_
_Última actualización: Marzo 2026_
