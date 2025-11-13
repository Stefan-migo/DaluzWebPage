# Guía de Herramientas de Mantenimiento

## Estado de Implementación

### ✅ Completamente Implementadas

1. **Limpiar Logs** - Funcional
2. **Verificar Seguridad** - Funcional  
3. **Estado Sistema** - Funcional
4. **Optimizar DB** - ✅ **RECIÉN IMPLEMENTADO**

### ⚠️ Pendientes de Implementación

5. **Test Email** - Requiere configuración de Resend
6. **Backup Base de Datos** - Requiere configuración de almacenamiento

---

## 1. Test Email - Configuración de Resend

### ¿Puedo usar Resend sin dominio?

**Sí**, Resend permite usar un dominio de prueba para desarrollo/testing:

#### Opción 1: Dominio de Prueba de Resend (Recomendado para Testing)

1. **Crear cuenta en Resend**: https://resend.com
2. **Obtener API Key**: Dashboard → API Keys → Create
3. **Usar dominio de prueba**: `onboarding@resend.dev` (automático, no requiere configuración)

**Configuración en `.env.local`:**

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Tu API key de Resend
RESEND_FROM_EMAIL=onboarding@resend.dev  # Dominio de prueba (sin configuración DNS)
```

**Limitaciones del dominio de prueba:**
- ✅ Funciona inmediatamente (sin DNS)
- ✅ Perfecto para desarrollo/testing
- ⚠️ Solo puedes enviar a tu propio email (el que usaste para registrarte en Resend)
- ⚠️ No es para producción

#### Opción 2: Dominio Verificado (Para Producción)

Cuando tengas el dominio del cliente:

1. **Agregar dominio en Resend**: Dashboard → Domains → Add Domain
2. **Configurar DNS records** (SPF, DKIM, DMARC)
3. **Verificar dominio** (puede tomar 24-48 horas)
4. **Actualizar `.env.local`**:

```bash
RESEND_FROM_EMAIL=noreply@tudominio.com  # Tu dominio verificado
```

### Implementación de Test Email

Una vez configurado Resend, la implementación es simple:

```typescript
// En /api/admin/system/maintenance/route.ts
case 'test_email':
  const { sendEmail } = await import('@/lib/email/client');
  
  const emailResult = await sendEmail({
    to: user.email,
    subject: 'Test Email - Sistema de Mantenimiento',
    html: `
      <h1>Email de Prueba</h1>
      <p>Este es un email de prueba del sistema de mantenimiento.</p>
      <p>Enviado por: ${user.email}</p>
      <p>Fecha: ${new Date().toLocaleString('es-AR')}</p>
    `,
    text: `Email de prueba del sistema de mantenimiento. Enviado por ${user.email}`
  });

  if (!emailResult.success) {
    return NextResponse.json({ 
      error: 'Error al enviar email',
      details: emailResult.error 
    }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true,
    message: `Email de prueba enviado a ${user.email}`,
    action: 'test_email',
    email_id: emailResult.id
  });
```

---

## 2. Backup Base de Datos - Opciones de Almacenamiento

### ¿Qué almacenamiento necesito?

Para backups de base de datos, necesitas un lugar donde guardar los archivos `.sql` o `.dump`. Aquí están las opciones:

### Opción 1: Supabase Storage (Recomendado para Supabase)

**Ventajas:**
- ✅ Integrado con Supabase
- ✅ Fácil de implementar
- ✅ Acceso directo desde la API
- ✅ Puedes configurar políticas de acceso

**Implementación:**

1. **Crear bucket en Supabase Storage**:
   ```sql
   -- Ejecutar en Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('database-backups', 'database-backups', false)
   ON CONFLICT DO NOTHING;
   ```

2. **Configurar políticas RLS**:
   ```sql
   CREATE POLICY "Admins can upload backups"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'database-backups' AND
     EXISTS (
       SELECT 1 FROM admin_users 
       WHERE id = auth.uid() AND is_active = true
     )
   );
   ```

3. **Implementar backup en API**:
   ```typescript
   // Usar pg_dump para crear backup
   // Subir archivo a Supabase Storage
   ```

### Opción 2: Sistema de Archivos Local (Solo Desarrollo)

**Ventajas:**
- ✅ Simple para desarrollo local
- ✅ No requiere configuración adicional

**Desventajas:**
- ❌ No funciona en producción (Vercel, etc.)
- ❌ No es persistente en servidores serverless

**Implementación:**
```typescript
// Solo para desarrollo local
import { writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Ejecutar pg_dump
const { stdout } = await execAsync(
  `pg_dump ${DATABASE_URL} > backup_${Date.now()}.sql`
);

// Guardar en carpeta local
await writeFile(`./backups/backup_${Date.now()}.sql`, stdout);
```

### Opción 3: Cloud Storage (Producción)

**Opciones:**
- **AWS S3** (más común)
- **Google Cloud Storage**
- **Azure Blob Storage**
- **Cloudflare R2** (más económico)

**Ventajas:**
- ✅ Escalable
- ✅ Persistente
- ✅ Accesible desde cualquier lugar
- ✅ Versionado y retención automática

**Desventajas:**
- ⚠️ Requiere configuración de credenciales
- ⚠️ Puede tener costos según uso

**Implementación con AWS S3 (ejemplo):**

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Crear backup
const backupData = await createDatabaseBackup();

// Subir a S3
await s3.send(new PutObjectCommand({
  Bucket: process.env.AWS_BACKUP_BUCKET!,
  Key: `backups/backup_${Date.now()}.sql`,
  Body: backupData,
}));
```

### Opción 4: Supabase CLI + Git (Híbrido)

**Para desarrollo local:**
- Usar `supabase db dump` para crear backups
- Guardar en carpeta local `./backups/`
- Opcional: commitear a Git (solo para desarrollo)

---

## Recomendación por Escenario

### Desarrollo Local
- **Test Email**: Usar `onboarding@resend.dev` (dominio de prueba)
- **Backup**: Sistema de archivos local (`./backups/`)

### Producción (Vercel + Supabase)
- **Test Email**: Dominio verificado del cliente
- **Backup**: Supabase Storage o AWS S3

---

## Próximos Pasos

1. **Test Email**: 
   - Configurar Resend con dominio de prueba
   - Implementar envío real de email
   - Tiempo estimado: 15-20 minutos

2. **Backup Base de Datos**:
   - Decidir opción de almacenamiento
   - Implementar `pg_dump` o usar Supabase Storage
   - Tiempo estimado: 1-2 horas

---

## Notas Importantes

- **Backups automáticos**: Supabase ya hace backups automáticos (en plan Pro+)
- **Backups manuales**: Útiles para migraciones, antes de cambios grandes, etc.
- **Retención**: Considera cuánto tiempo mantener los backups (30 días, 90 días, etc.)
- **Seguridad**: Los backups contienen datos sensibles, asegúrate de encriptarlos si los guardas externamente

