# Guía de Configuración de Resend (Modo Desarrollo)

## Paso 1: Crear Cuenta en Resend

1. Ve a https://resend.com
2. Click en **"Sign Up"** o **"Get Started"**
3. Crea tu cuenta con tu email (este será el único email al que podrás enviar en modo desarrollo)

## Paso 2: Obtener API Key

1. Una vez dentro del dashboard, ve a **"API Keys"** en el menú lateral
2. Click en **"Create API Key"**
3. Dale un nombre (ej: "Development Key")
4. Selecciona permisos: **"Sending access"** (suficiente para desarrollo)
5. Click en **"Add"**
6. **IMPORTANTE**: Copia el API Key inmediatamente (solo se muestra una vez)
   - Formato: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Paso 3: Configurar Variables de Entorno

1. Abre tu archivo `.env.local` en la raíz del proyecto
2. Agrega estas líneas:

```bash
# Resend Email Service (Development Mode - No Domain Required)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Notas importantes:**
- `RESEND_API_KEY`: Pega el API key que copiaste en el paso 2
- `RESEND_FROM_EMAIL`: Usa `onboarding@resend.dev` (dominio de prueba de Resend, no requiere configuración DNS)

## Paso 4: Verificar Configuración

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Deberías ver en la consola:
   - ✅ Sin warnings sobre `RESEND_API_KEY not configured`
   - Si ves el warning, verifica que el archivo `.env.local` esté en la raíz del proyecto

## Paso 5: Probar Envío de Email

1. Ve a `/admin/system` en tu aplicación
2. Click en el tab **"Mantenimiento"**
3. Click en el botón **"Test Email"**
4. Deberías recibir un email en tu cuenta de Resend (el email con el que te registraste)

---

## Limitaciones del Modo Desarrollo

### ✅ Lo que SÍ puedes hacer:
- Enviar emails a tu propio email (el que usaste para registrarte en Resend)
- Probar la funcionalidad de envío de emails
- Ver logs de emails enviados en el dashboard de Resend
- Desarrollar y testear la funcionalidad completa

### ⚠️ Limitaciones:
- **Solo puedes enviar a tu propio email** (el de tu cuenta de Resend)
- No puedes enviar a otros emails
- Los emails vienen de `onboarding@resend.dev` (no es tu dominio)
- No es para producción

---

## Para Producción (Cuando Tengas el Dominio)

Cuando tengas el dominio del cliente, necesitarás:

1. **Agregar dominio en Resend**:
   - Dashboard → Domains → Add Domain
   - Agregar `tudominio.com`

2. **Configurar DNS Records**:
   - SPF record
   - DKIM record
   - DMARC record (opcional pero recomendado)

3. **Verificar dominio** (puede tomar 24-48 horas)

4. **Actualizar `.env.local`**:
   ```bash
   RESEND_FROM_EMAIL=noreply@tudominio.com
   ```

---

## Troubleshooting

### Error: "Resend not configured"
- Verifica que `.env.local` existe en la raíz del proyecto
- Verifica que `RESEND_API_KEY` está correctamente escrito
- Reinicia el servidor después de agregar las variables

### Error: "Invalid API Key"
- Verifica que copiaste el API key completo
- Asegúrate de que no hay espacios extra
- Verifica que el API key no expiró (crea uno nuevo si es necesario)

### No recibo emails
- Verifica que estás enviando a tu propio email (el de tu cuenta de Resend)
- Revisa la carpeta de spam
- Revisa el dashboard de Resend para ver logs de envío

### Email va a spam
- En modo desarrollo es normal (viene de `onboarding@resend.dev`)
- En producción, con dominio verificado, esto se soluciona

---

## Próximos Pasos

Una vez configurado Resend:
1. ✅ Test Email funcionará en `/admin/system` → Mantenimiento
2. ✅ Todos los emails del sistema funcionarán (tickets, órdenes, etc.)
3. ✅ Podrás ver logs de emails en el dashboard de Resend

