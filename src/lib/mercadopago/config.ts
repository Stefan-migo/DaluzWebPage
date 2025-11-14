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
        'mercadopago_webhook_secret',
        'mercadopago_test_access_token',
        'mercadopago_test_public_key',
        'mercadopago_test_webhook_secret',
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

      // Determine if test mode is enabled
      const testMode = configMap['mercadopago_test_mode'] === true || configMap['mercadopago_test_mode'] === 'true';
      
      // Use test credentials if test mode is enabled, otherwise use production credentials
      let accessToken: string | undefined;
      let publicKey: string | undefined;
      let webhookSecret: string | undefined;
      
      if (testMode) {
        // Use test credentials
        accessToken = configMap['mercadopago_test_access_token'];
        publicKey = configMap['mercadopago_test_public_key'];
        webhookSecret = configMap['mercadopago_test_webhook_secret'];
      } else {
        // Use production credentials
        accessToken = configMap['mercadopago_access_token'];
        publicKey = configMap['mercadopago_public_key'];
        webhookSecret = configMap['mercadopago_webhook_secret'];
      }
      
      // If we have access token in database, use it
      if (accessToken && 
          accessToken !== 'PROD_ACCESS_TOKEN_HERE' && 
          accessToken !== 'TEST_ACCESS_TOKEN_HERE') {
        return {
          accessToken,
          publicKey: publicKey || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
          webhookSecret,
          testMode,
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
  const envAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!envAccessToken) {
    throw new Error('MercadoPago access token not configured in database or environment variables');
  }
  
  return {
    accessToken: envAccessToken,
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

