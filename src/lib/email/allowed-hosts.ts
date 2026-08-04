/**
 * Allowlist de hosts para la ruta de miniaturas de correo.
 *
 * Vive fuera del route handler a proposito: Next.js solo permite exportar
 * GET/POST/runtime/etc desde un archivo de ruta, asi que exportar un helper
 * desde ahi rompe el build ("no es un campo de exportacion de ruta valido").
 * Separarlo ademas lo hace testeable.
 *
 * Sin esta allowlist, /api/email/image seria un open proxy: cualquiera podria
 * pasarle src=http://169.254.169.254/... para alcanzar direcciones internas
 * (SSRF), o colgarse del servidor como CDN gratis para servir sus imagenes.
 */
export function isAllowedImageHost(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const allowed = new Set<string>();
  for (const envUrl of [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ]) {
    if (!envUrl) continue;
    try {
      allowed.add(new URL(envUrl).host);
    } catch {
      // Variable de entorno mal formada: se ignora en vez de romper.
    }
  }

  return allowed.has(parsed.host);
}
