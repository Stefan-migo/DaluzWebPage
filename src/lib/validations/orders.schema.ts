import { z } from "zod";

export const manualOrderSchema = z.object({
  email: z.string().email("Email is required"),
  total_amount: z.number().positive("Total amount must be greater than 0"),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  subtotal: z.number().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  shipping: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      address_1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        product_id: z.string(),
        quantity: z.number().int().positive(),
        unit_price: z.number().positive(),
        product_name: z.string(),
        variant_title: z.string().optional(),
      }),
    )
    .optional(),
});

export const adminOrderActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("get_stats"),
  }),
  z.object({
    action: z.literal("create_manual_order"),
    orderData: manualOrderSchema,
  }),
]);

export type ManualOrderInput = z.infer<typeof manualOrderSchema>;
