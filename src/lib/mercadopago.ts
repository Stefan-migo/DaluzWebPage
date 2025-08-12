import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Mercado Pago configuration for DA LUZ CONSCIENTE - Argentina market
const mercadopagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

// Initialize Mercado Pago clients
export const payment = new Payment(mercadopagoConfig);
export const preference = new Preference(mercadopagoConfig);

// Argentina-specific configuration
export const MERCADOPAGO_CONFIG = {
  // Supported payment methods for Argentina
  PAYMENT_METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    BANK_TRANSFER: 'bank_transfer',
    CASH: 'ticket', // Rapipago, Pago Fácil, etc.
    MERCADO_PAGO: 'account_money'
  },
  
  // Currency for Argentina market
  CURRENCY: 'ARS',
  
  // Argentina-specific excluded payment methods
  EXCLUDED_PAYMENT_METHODS: [
    // Exclude international cards if needed
  ],
  
  // Argentina payment installment options
  INSTALLMENTS: {
    MAX_INSTALLMENTS: 12,
    DEFAULT_INSTALLMENTS: 3
  },
  
  // Webhook notification URLs
  WEBHOOK_EVENTS: [
    'payment',
    'plan',
    'subscription',
    'invoice',
    'point_integration_wh'
  ]
};

// Helper function to format Argentina prices
export function formatArgentinePesos(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper function to create preference for Argentina market
export async function createArgentinaPreference(preferenceData: {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }>;
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code: string;
      number: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    address?: {
      street_name?: string;
      street_number?: string;
      zip_code?: string;
    };
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  metadata?: Record<string, any>;
}) {
  try {
    // Set Argentina-specific defaults
    const items = preferenceData.items.map(item => ({
      ...item,
      currency_id: item.currency_id || MERCADOPAGO_CONFIG.CURRENCY
    }));

    // Create preference with Argentina market optimizations
    const preferenceRequest = {
      items,
      payer: preferenceData.payer,
      back_urls: preferenceData.back_urls || {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`
      },
      auto_return: preferenceData.auto_return || 'approved' as const,
      external_reference: preferenceData.external_reference,
      notification_url: preferenceData.notification_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      metadata: preferenceData.metadata,
      
      // Argentina-specific settings
      payment_methods: {
        excluded_payment_methods: MERCADOPAGO_CONFIG.EXCLUDED_PAYMENT_METHODS,
        excluded_payment_types: [],
        installments: MERCADOPAGO_CONFIG.INSTALLMENTS.MAX_INSTALLMENTS,
        default_installments: MERCADOPAGO_CONFIG.INSTALLMENTS.DEFAULT_INSTALLMENTS
      },
      
      // Checkout experience
      binary_mode: false, // Allow pending payments for cash methods
      expires: false, // No expiration for cash payments
      
      // Additional info for Argentina compliance
      additional_info: process.env.NODE_ENV === 'production' ? 'DA LUZ CONSCIENTE - Productos naturales y membresía' : 'TEST - DA LUZ CONSCIENTE',
      
      // Shipment configuration
      shipments: {
        mode: 'not_specified', // We'll handle shipping separately
        local_pickup: true,
        free_shipping: false
      }
    };

    const response = await preference.create({ body: preferenceRequest });
    return response;
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    throw error;
  }
}

// Helper function to get payment by ID
export async function getPaymentById(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId });
    return response;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
}

// Payment status mapping for Argentina market
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  AUTHORIZED: 'authorized',
  IN_PROCESS: 'in_process',
  IN_MEDIATION: 'in_mediation',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  CHARGED_BACK: 'charged_back'
} as const;

// Argentina-specific payment method labels
export const ARGENTINA_PAYMENT_LABELS = {
  visa: 'Visa',
  master: 'Mastercard',
  amex: 'American Express',
  naranja: 'Naranja',
  cabal: 'Cabal',
  cencosud: 'Cencosud',
  cordobesa: 'Cordobesa',
  argencard: 'Argencard',
  pagofacil: 'Pago Fácil',
  rapipago: 'Rapipago',
  bapropagos: 'Bapro Pagos',
  cobro_express: 'Cobro Express',
  account_money: 'Dinero en cuenta de Mercado Pago',
  debin: 'Débito inmediato (DEBIN)',
  pse: 'PSE'
};

export default mercadopagoConfig; 