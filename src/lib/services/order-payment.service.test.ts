import { describe, it, expect, vi } from "vitest";
import { OrderPaymentService } from "./order-payment.service";

function makeDeps(paymentStatus: string) {
  const ordersRepo = {
    findById: vi.fn().mockResolvedValue({
      id: "o1",
      user_id: "u1",
      payment_status: paymentStatus,
    }),
    findByIdWithItems: vi.fn().mockResolvedValue({
      id: "o1",
      email: "cliente@test.com",
      order_number: "DL-1",
      total_amount: 1000,
      payment_status: paymentStatus,
    }),
    getItemsByOrderId: vi.fn().mockResolvedValue([{ product_id: "p1", quantity: 2 }]),
    update: vi.fn().mockResolvedValue(undefined),
  };
  const productsRepo = {
    decreaseStock: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn(),
    update: vi.fn(),
  };
  return { ordersRepo, productsRepo };
}

describe("confirmOrderPayment", () => {
  it("descuenta stock y marca el pedido como pagado", async () => {
    const { ordersRepo, productsRepo } = makeDeps("awaiting_transfer");
    const svc = new OrderPaymentService(ordersRepo as never, productsRepo as never);

    await svc.confirmOrderPayment("o1");

    expect(productsRepo.decreaseStock).toHaveBeenCalledWith("p1", 2);
    expect(ordersRepo.update).toHaveBeenCalledWith(
      "o1",
      expect.objectContaining({ payment_status: "paid", status: "paid" }),
    );
  });

  it("no vuelve a descontar stock si el pedido ya estaba pagado", async () => {
    const { ordersRepo, productsRepo } = makeDeps("paid");
    const svc = new OrderPaymentService(ordersRepo as never, productsRepo as never);

    await svc.confirmOrderPayment("o1");

    expect(productsRepo.decreaseStock).not.toHaveBeenCalled();
    expect(ordersRepo.update).not.toHaveBeenCalled();
  });

  it("no explota si el pedido no existe", async () => {
    const { ordersRepo, productsRepo } = makeDeps("paid");
    ordersRepo.findById = vi.fn().mockResolvedValue(null);
    const svc = new OrderPaymentService(ordersRepo as never, productsRepo as never);

    await expect(svc.confirmOrderPayment("noexiste")).resolves.toBeUndefined();
  });
});
