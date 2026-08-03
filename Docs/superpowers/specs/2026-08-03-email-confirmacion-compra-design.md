# Email de confirmación de compra con imágenes de producto

**Fecha:** 2026-08-03
**Scope:** Solo `order_confirmation`. Los demás templates (`order_shipped`, `order_delivered`, `payment_success`, `payment_failed`) no se tocan.

---

## 1. Objetivo

Enriquecer el mail de confirmación de compra al nivel de una tienda comercial: miniaturas de los productos comprados, desglose de totales y dirección de envío. Hoy el mail solo lista nombre, cantidad y total por línea, y muestra un único total final sin explicar cómo se llega a ese número.

## 2. Problemas actuales verificados

1. **Sin imágenes.** `formatOrderItemsHTML` (`src/lib/email/template-utils.ts:42`) genera solo texto.
2. **Roto en Outlook.** Ese mismo renderer usa `display: flex`, que Outlook ignora por completo: las filas de productos se apilan mal.
3. **Datos desaprovechados.** `orders` ya tiene `subtotal`, `shipping_amount`, `discount_amount`, `tax_amount` y la dirección de envío desglosada en 8 columnas. El mail solo usa `total_amount`.
4. **Texto plano basura.** La versión de texto se genera arrancando etiquetas del HTML con regex (`src/lib/email/notifications.ts:125-129`). Con tablas produce un choclo ilegible, y una parte de texto pobre empeora el puntaje anti-spam.
5. **Datos de imagen sucios.** Existe una guarda `isValidImage` que descarta URLs `file://` (`src/app/(commerce)/productos/[slug]/page.tsx:502`), o sea que hay productos con rutas `file://` guardadas en `featured_image`.

## 3. Alcance

### Incluido
- Bloque de productos con miniatura, nombre, variante, cantidad, precio unitario y total de línea.
- Desglose de totales: subtotal, envío, descuento, total.
- Bloque de dirección de envío.
- Ruta de miniaturas que normaliza formato y peso.
- Versión de texto plano construida explícitamente.

### Excluido
- Botón "Ver mi pedido". Se puede comprar como invitado, así que el CTA no le serviría a una parte de los clientes.
- Los otros cuatro templates transaccionales.
- Rediseño visual del encabezado/pie, que siguen viniendo del template en base de datos.

## 4. Enfoque elegido

**Extender el patrón de inyección de variables que ya existe**, en lugar de mover el mail a código.

El código genera los bloques complejos ya renderizados y a prueba de clientes de correo; el template en `email_templates.content` conserva la cáscara (encabezado, saludo, pie) y sigue siendo editable desde el panel de administración.

Se descartó mover el mail entero a código: perdería la edición desde el panel justo en el mail más importante, y haría que este template funcione distinto de los otros cuatro. El markup frágil vive en código, donde se testea; el copy vive en la base, donde se edita sin deploy.

## 5. Arquitectura

### 5.1 Capa de datos

**Migración nueva:** `supabase/migrations/<timestamp>_add_product_image_to_order_items.sql`

```sql
ALTER TABLE order_items ADD COLUMN product_image text;

UPDATE order_items oi SET product_image = p.featured_image
FROM products p
WHERE oi.product_id = p.id AND oi.product_image IS NULL;
```

`order_items` ya congela `product_name`, `variant_title` y `unit_price` al momento de la compra. La imagen sigue el mismo criterio: el mail queda como registro fiel de lo comprado aunque después se cambie la foto o se dé de baja el producto.

El backfill deja a las órdenes históricas con la imagen *actual* del producto — es lo mejor disponible; de ahí en adelante el dato es fiel.

**Escritura:** `src/lib/services/checkout.service.ts`, donde ya se insertan los `order_items`, guarda además `featured_image` del producto.

**Criterio:** se guarda la URL **cruda, sin sanear**. El saneo ocurre al renderizar. Si se guardara ya saneada y mañana mejora la regla, las filas viejas quedarían mal para siempre.

### 5.2 Ruta de miniaturas

**Archivo nuevo:** `src/app/api/email/image/route.ts`

```
GET /api/email/image?src=<url>&w=128
```

Devuelve **siempre JPEG**, redimensionado. Usa `sharp` (ya instalado, `^0.35.3`).

Resuelve dos problemas de una:

- **Formato.** Outlook no renderiza webp. Forzar JPEG lo hace universal.
- **Peso.** Las fotos de producto son de página, no miniaturas. Cuatro productos podían irse a varios MB; Gmail recorta los mails pesados con "[Mensaje recortado]". A 128px cada miniatura queda en pocos KB.

**Seguridad — allowlist de hosts obligatoria.** Solo se acepta `src` del dominio de Supabase Storage del proyecto y del dominio propio. Sin esa restricción la ruta es un *open proxy*: permitiría alcanzar direcciones internas vía SSRF (`http://169.254.169.254/...`) o usar el servidor como CDN gratis de terceros.

**Caché:** `Cache-Control: public, max-age=31536000, immutable`. La imagen de un pedido ya emitido no cambia nunca.

**Errores:** ante cualquier fallo —host no permitido, 404, imagen corrupta— devuelve el placeholder JPEG con 200. Nunca un 5xx: un error acá sería un hueco roto en el mail del cliente.

**El placeholder** es un archivo estático del repo servido desde `public/` (JPEG, 128×128, neutro con la marca). No se genera al vuelo: tiene que poder servirse aunque `sharp` falle.

### 5.3 Capa de render

**Archivo nuevo:** `src/lib/email/blocks.ts`

No se suma a `template-utils.ts`: ese archivo hace sustitución de variables genérica, y agregarle el markup de tablas lo llevaría de ~100 a ~300 líneas mezclando dos responsabilidades.

Cuatro funciones puras:

| Función | Responsabilidad |
|---|---|
| `resolveEmailImageUrl(url)` | Descarta `file://`, `data:` y vacíos; resuelve rutas relativas contra `emailConfig.domain`; deja pasar `http(s)`. Devuelve la URL de `/api/email/image`. Ante cualquier otro caso, el placeholder. |
| `renderOrderItems(items)` | Una fila por producto: miniatura, nombre, variante, cantidad, precio unitario, total de línea. |
| `renderOrderTotals(order)` | Subtotal, envío, descuento, total. Si el descuento es 0 se omite la fila; si el envío es 0 se muestra **"Gratis"**, porque el envío sin costo es información que el cliente quiere ver, no una fila vacía. |
| `renderShippingAddress(order)` | Bloque de dirección. Devuelve `''` si la orden no tiene dirección, para que el bloque desaparezca en vez de renderizarse vacío. |

**Reglas de HTML para correo:**

- `<table role="presentation" cellpadding="0" cellspacing="0" border="0">`. Nunca flex ni grid.
- Estilos **inline**. Sin bloque `<style>`: Gmail descarta buena parte de lo que va en el `<head>`.
- `<img>` con atributos `width` y `height`, no solo CSS — Outlook ignora el CSS de dimensiones.
- `alt` con el nombre del producto en toda imagen. Muchos clientes bloquean imágenes por defecto y el `alt` es lo único que se lee.
- Ancho fijo 600px. Sin `background-image`.

### 5.4 Variables del template

| Variable | Estado |
|---|---|
| `{{order_items}}` | **Mantiene el nombre.** El template actual no se rompe; empieza a renderizar contenido más rico. |
| `{{order_totals}}` | Nueva |
| `{{shipping_address}}` | Nueva |

**Migración:** actualiza el `content` de la fila `order_confirmation` en `email_templates` para incluir los dos placeholders nuevos.

`src/lib/email/notifications.ts` arma las tres variables y las pasa a `replaceTemplateVariables`.

### 5.5 Texto plano

Se reemplaza el stripping por regex por una construcción explícita desde los mismos datos, reusando `formatOrderItemsText` y sumando totales y dirección.

## 6. Manejo de errores

| Caso | Comportamiento |
|---|---|
| Imagen inválida o inalcanzable | Placeholder JPEG |
| Orden sin dirección de envío | El bloque no se renderiza |
| Item sin nombre | Fallback `"Producto"` (ya existe) |
| Template inactivo o ausente | Warning y no se envía (ya existe) |
| Fallo de envío en Resend | Se loguea y se devuelve `{ success: false, error }` |

**Un fallo de mail nunca debe romper la compra.** El envío ya devuelve un resultado en vez de tirar excepción; el diseño mantiene esa propiedad. Que Resend esté caído no puede hacer perder una venta.

## 7. Pruebas

Vitest ya está configurado (`npm test`). Las cuatro funciones de render son puras.

**Casos:**
- Imagen: válida / `file://` / ruta relativa / ausente.
- Host de `src`: permitido / no permitido.
- Orden con y sin dirección de envío.
- Orden con y sin descuento.

**Sin snapshots del HTML completo** — son frágiles y se rompen con cualquier cambio de espaciado. Se afirman propiedades concretas: que contenga `<table`, que **no** contenga `display:flex`, que cada `<img>` tenga atributo `width` y `alt` no vacío.

**Límite explícito:** los tests unitarios verifican que se genera el HTML pretendido, **no que se vea bien en Gmail o en Outlook**. Eso solo se comprueba enviando de verdad. La validación final es un envío de prueba a una casilla de cada proveedor usando el endpoint ya existente `/api/admin/system/email-templates/[id]/test`.

## 8. Riesgos

- **Productos con `featured_image` en `file://`.** Confirmado que existen. Quedan con placeholder; no rompen el mail.
- **Órdenes viejas sin imagen.** El backfill las cubre por join con `products`; las de productos ya borrados quedan con placeholder.
- **Gmail cachea las miniaturas en su proxy.** Si se corrige una imagen después de enviar el mail, el cliente puede seguir viendo la vieja. Aceptable.

## 9. Dependencia con el proyecto de transferencias

Este spec se ejecuta primero a propósito. El flujo de transferencia bancaria necesita mandar un mail de instrucciones con CBU/alias y el detalle del pedido, y va a reusar `renderOrderItems`, `renderOrderTotals` y la ruta de miniaturas definidas acá.
