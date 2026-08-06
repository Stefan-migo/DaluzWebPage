import { MercadoPagoConfig, Preference } from "mercadopago";
import {
  getMercadoPagoConfig,
  getMercadoPagoAccessToken,
} from "@/lib/mercadopago/config";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { createServiceRoleClient } from "@/utils/supabase/server";

// ============================================
// Types
// ============================================

export interface CartItem {
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string | null;
  sku?: string | null;
}

export interface CustomerInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  addressNumber: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
}

interface PaymentMethodsConfig {
  excluded_payment_methods?: { id: string }[];
  installments?: number;
}

export interface CheckoutResult {
  preferenceId: string;
  initPoint: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  [key: string]: unknown;
}

// ============================================
// Service
// ============================================

export class CheckoutService {
  constructor(private ordersRepo: OrdersRepository) { }

  /**
   * Create an order in the database.
   */
  async createOrder(
    userId: string,
    customerInfo: CustomerInfo,
    items: CartItem[],
    paymentMethod: "mercadopago" | "bank_transfer" = "mercadopago",
    totals?: { subtotal: number; discount: number; total: number },
  ): Promise<OrderRecord> {
    const fallbackTotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // Los totales llegan ya calculados en el flujo de transferencia, que aplica
    // el descuento por producto. MercadoPago usa el total de lista.
    const subtotal = totals?.subtotal ?? fallbackTotal;
    const discount = totals?.discount ?? 0;
    const totalAmount = totals?.total ?? fallbackTotal;

    const isTransfer = paymentMethod === "bank_transfer";

    // El checkout ya recolecta y valida nombre, telefono y direccion, pero
    // antes solo se los mandaba a MercadoPago y no quedaban en la orden. Sin
    // esto el mail de confirmacion no puede saludar por nombre ni mostrar el
    // domicilio, y el pedido queda sin datos de envio para preparar el despacho.
    // Los nombres de columna salen de la migracion 20241220000001, NO de
    // src/types/database.ts: ese archivo esta desactualizado y describe
    // columnas que no existen (shipping_name, shipping_address, notes).
    const streetAddress = [customerInfo.address, customerInfo.addressNumber]
      .filter(Boolean)
      .join(" ")
      .trim();

    try {
      const order = await this.ordersRepo.insert({
        order_number: `DL-${Date.now()}`,
        user_id: userId,
        email: customerInfo.email,
        status: "pending",
        subtotal,
        discount_amount: discount,
        total_amount: totalAmount,
        currency: "ARS",
        payment_method: isTransfer ? "bank_transfer" : null,
        payment_status: isTransfer ? "awaiting_transfer" : "pending",
        transfer_expires_at: isTransfer
          ? new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
          : null,
        shipping_first_name: customerInfo.firstName || null,
        shipping_last_name: customerInfo.lastName || null,
        shipping_phone: customerInfo.phone || null,
        shipping_address_1: streetAddress || null,
        shipping_city: customerInfo.city || null,
        shipping_state: customerInfo.state || null,
        shipping_postal_code: customerInfo.postalCode || null,
        shipping_country: customerInfo.country || "Argentina",
        customer_notes: customerInfo.notes || null,
      });

      return order as OrderRecord;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  /**
   * Create order items. If this fails, rolls back the order automatically.
   */
  async createOrderItems(orderId: string, items: CartItem[]): Promise<void> {
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      product_name: item.name,
      product_image: item.image || null,
      variant_title: item.size || null,
      sku: item.sku || null,
    }));

    try {
      await this.ordersRepo.insertItems(orderItems);
    } catch (error) {
      console.error("Error creating order items:", error);
      // Rollback: delete the orphan order
      await this.rollbackOrder(orderId);
      throw new Error("Failed to create order items");
    }
  }

  /**
   * Create a MercadoPago payment preference for the given order.
   */
  async createMercadoPagoPreference(
    order: OrderRecord,
    items: CartItem[],
    customerInfo: CustomerInfo,
  ): Promise<CheckoutResult> {
    const mpConfig = await getMercadoPagoConfig();
    const accessToken = await getMercadoPagoAccessToken();

    if (
      !accessToken ||
      accessToken === "PROD_ACCESS_TOKEN_HERE" ||
      accessToken.trim() === ""
    ) {
      throw new Error(
        "Access token is not configured. Please configure MercadoPago credentials in the admin panel.",
      );
    }

    const mpClientConfig = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
        idempotencyKey: `checkout-${order.id}-${Date.now()}`,
      },
    });

    const preference = new Preference(mpClientConfig);

    const preferenceItems = items.map((item) => ({
      id: item.productId,
      title: item.name,
      description: item.size || "",
      picture_url: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    }));

    // Build payment methods configuration
    const paymentMethodsConfig: PaymentMethodsConfig = {};
    if (mpConfig.paymentMethods && mpConfig.paymentMethods.length > 0) {
      const allMethods = ["credit_card", "debit_card", "cash", "bank_transfer"];
      const excludedMethods = allMethods.filter(
        (m) => !mpConfig.paymentMethods.includes(m),
      );
      if (excludedMethods.length > 0) {
        paymentMethodsConfig.excluded_payment_methods = excludedMethods.map(
          (m) => ({ id: m }),
        );
      }
    }

    const cartInstallmentsCap = await this.computeCartInstallmentsCap(items);
    const globalCap = mpConfig.maxInstallments ?? null;
    const effectiveCap =
      globalCap !== null
        ? Math.min(globalCap, cartInstallmentsCap)
        : cartInstallmentsCap;
    if (effectiveCap > 1) {
      paymentMethodsConfig.installments = effectiveCap;
    } else {
      // Force single payment (no interest-free installments) when the cart
      // contains a product that has neither 3 nor 6 cuotas enabled.
      paymentMethodsConfig.installments = 1;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;

    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: customerInfo.firstName,
          surname: customerInfo.lastName,
          email: customerInfo.email,
        },
        back_urls: {
          success: `${appUrl}/checkout/success`,
          failure: `${appUrl}/checkout/failure`,
        },
        auto_return: mpConfig.autoReturn ? "approved" : undefined,
        binary_mode: mpConfig.binaryMode,
        external_reference: order.id.toString(),
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        payment_methods:
          Object.keys(paymentMethodsConfig).length > 0
            ? paymentMethodsConfig
            : undefined,
      },
    });

    // Save preference ID to the order
    await this.ordersRepo.update(order.id, { mercadopago_preference_id: result.id });

    return {
      preferenceId: result.id!,
      initPoint: result.init_point!,
    };
  }

  /**
   * Compute the max installments cap for the cart using rule R1
   * (strict minimum). For each product the cap is 6 if six installments are
   * enabled, else 3 if three installments are enabled, else 1. The cart cap
   * is the minimum across all products, so any single product without any
   * installments enabled forces the entire cart to 1 (no installments).
   */
  private async computeCartInstallmentsCap(items: CartItem[]): Promise<number> {
    if (items.length === 0) return 1;

    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, installments_3_enabled, installments_6_enabled")
      .in("id", productIds);

    if (error || !data) {
      console.error("Error fetching installments flags:", error);
      return 1;
    }

    const flagsById = new Map(
      data.map((p: any) => [
        p.id,
        {
          three: !!p.installments_3_enabled,
          six: !!p.installments_6_enabled,
        },
      ]),
    );

    let cap = Infinity;
    for (const id of productIds) {
      const flags = flagsById.get(id);
      const productCap = flags?.six ? 6 : flags?.three ? 3 : 1;
      if (productCap < cap) cap = productCap;
      if (cap === 1) break;
    }

    return cap === Infinity ? 1 : cap;
  }

  /**
   * Delete an orphan order (used when items or MP fails).
   */
  async rollbackOrder(orderId: string): Promise<void> {
    try {
      await this.ordersRepo.remove(orderId);
    } catch (err) {
      console.error(`Failed to rollback order ${orderId}:`, err);
    }
    console.error(`Rolled back order ${orderId}`);
  }

  /**
   * Mark an order as failed with a reason (used when MP preference fails).
   */
  async markOrderFailed(orderId: string, reason: string): Promise<void> {
    try {
      await this.ordersRepo.update(orderId, {
        status: "failed",
        customer_notes: `MercadoPago Error: ${reason.substring(0, 200)}`,
      });
      console.error(`🔄 Order ${orderId} marked as failed`);
    } catch (rollbackError) {
      console.error("Failed to rollback order status:", rollbackError);
    }
  }

  /**
   * Retrieve an order by ID.
   */
  async getOrder(orderId: string) {
    const order = await this.ordersRepo.findById(orderId);

    if (!order) {
      return null;
    }

    return {
      order_id: order.id,
      status: order.status,
      total_amount: order.total_amount || order.total,
      currency: order.currency,
      preference_id: order.mercadopago_preference_id,
      created_at: order.created_at,
    };
  }
}
