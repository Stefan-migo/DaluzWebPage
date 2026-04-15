/**
 * Environment variable validation — imported at app startup for fail-fast behavior.
 *
 * SECURITY: Ensures all required secrets are present before the app serves any
 * requests. Missing variables cause a build/startup failure instead of a subtle
 * runtime error that could expose default or undefined values.
 */

const requiredServerVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

const requiredForProduction = [
  'MERCADOPAGO_ACCESS_TOKEN',
  'RESEND_API_KEY',
] as const;

function validateEnv() {
  const missing: string[] = [];

  for (const key of requiredServerVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    for (const key of requiredForProduction) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n\n` +
      'Set them in .env.local or your hosting provider\'s environment settings.',
    );
  }
}

// Run validation on import (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}
