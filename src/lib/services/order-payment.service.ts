import { EmailNotificationService } from "@/lib/email/notifications";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { ProductsRepository } from "@/lib/repositories/products.repository";

/**
 * Efectos del cobro de un pedido: marcarlo pagado, descontar inventario y
 * avisar al cliente.
 *
 * Vive aparte porque lo usan DOS caminos: el webhook de MercadoPago y la
 * confirmacion manual de una transferencia desde el panel. Antes esto estaba
 * dentro de webhook.service.ts, asi que confirmar una transferencia a mano no
 * mandaba mail ni descontaba stock.
 */
export class OrderPaymentService {
  constructor(
    private ordersRepo: OrdersRepository,
    private productsRepo: ProductsRepository,
  ) {}

  async confirmOrderPayment(orderId: string): Promise<void> {
    const order = await this.ordersRepo.findById(orderId);
    if (!order) return;

    // Idempotencia: sin esto, confirmar dos veces descontaria stock dos veces.
    if (order.payment_status === "paid") return;

    await this.ordersRepo.update(orderId, {
      status: "paid",
      payment_status: "paid",
      updated_at: new Date().toISOString(),
    });

    await this.decreaseInventory(orderId);
    await this.sendConfirmation(orderId);
  }

  private async decreaseInventory(orderId: string): Promise<void> {
    try {
      const items = await this.ordersRepo.getItemsByOrderId(orderId);
      if (!items || items.length === 0) return;

      for (const item of items) {
        try {
          await this.productsRepo.decreaseStock(item.product_id, item.quantity);
        } catch (stockError) {
          console.warn("RPC decreaseStock fallo, actualizando directo:", stockError);
          const product = await this.productsRepo.findById(item.product_id);
          if (!product) continue;

          const newInventory = Math.max(
            0,
            (product.inventory_quantity ?? 0) - item.quantity,
          );
          const newStock = Math.max(
            0,
            (product.stock_quantity ?? product.inventory_quantity ?? 0) - item.quantity,
          );
          try {
            await this.productsRepo.update(item.product_id, {
              inventory_quantity: newInventory,
              stock_quantity: newStock,
              updated_at: new Date().toISOString(),
            });
          } catch (updateErr) {
            console.error(
              `No se pudo actualizar stock de ${item.product_id}:`,
              updateErr,
            );
          }
        }
      }
    } catch (error) {
      // Un fallo de inventario no debe abortar la confirmacion del cobro.
      console.error("Error actualizando inventario:", error);
    }
  }

  private async sendConfirmation(orderId: string): Promise<void> {
    try {
      const order = await this.ordersRepo.findByIdWithItems(orderId);
      if (order && order.email) {
        await EmailNotificationService.sendOrderConfirmation(order as never);
      }
    } catch (error) {
      console.error("Error enviando confirmacion:", error);
    }
  }
}
