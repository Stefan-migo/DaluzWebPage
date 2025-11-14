import { createClient } from '@supabase/supabase-js';

/**
 * Get MercadoPago configuration from database with fallback to environment variables
 * Database config has priority over .env for flexibility
 */
export async function getMercadoPagoConfig() {
  try {
    // Try to get config from database first
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: configs, error } = await supabase
      .from('system_config')
      .select('config_key, config_value')
      .in('config_key', [
        'mercadopago_access_token',
        'mercadopago_public_key',
        'mercadopago_test_mode',
        'mercadopago_payment_methods',
        'mercadopago_max_installments',
        'mercadopago_auto_return',
        'mercadopago_binary_mode'
      ]);

    if (!error && configs && configs.length > 0) {
      const configMap: Record<string, any> = {};
      configs.forEach(config => {
        try {
          configMap[config.config_key] = JSON.parse(config.config_value);
        } catch {
          configMap[config.config_key] = config.config_value;
        }
      });

      // If we have access token in database, use it
      if (configMap['mercadopago_access_token'] && 
          configMap['mercadopago_access_token'] !== 'PROD_ACCESS_TOKEN_HERE') {
        return {
          accessToken: configMap['mercadopago_access_token'],
          publicKey: configMap['mercadopago_public_key'] || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
          testMode: configMap['mercadopago_test_mode'] === true || configMap['mercadopago_test_mode'] === 'true',
          paymentMethods: configMap['mercadopago_payment_methods'] || [],
          maxInstallments: configMap['mercadopago_max_installments'] || 12,
          autoReturn: configMap['mercadopago_auto_return'] ?? true,
          binaryMode: configMap['mercadopago_binary_mode'] || false,
          source: 'database' as const
        };
      }
    }
  } catch (error) {
    console.warn('Failed to load MercadoPago config from database, using env fallback:', error);
  }

  // Fallback to environment variables
  return {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
    testMode: process.env.NODE_ENV === 'development',
    paymentMethods: [],
    maxInstallments: 12,
    autoReturn: true,
    binaryMode: false,
    source: 'environment' as const
  };
}

/**
 * Get MercadoPago access token (for server-side use)
 */
export async function getMercadoPagoAccessToken(): Promise<string> {
  const config = await getMercadoPagoConfig();
  return config.accessToken;
}

