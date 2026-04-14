import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
  size: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
});

export const customerInfoSchema = z.object({
  email: z.string().email("A valid email is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z
    .string({ required_error: "Address number is required" })
    .min(1, "Address number is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

export const checkoutPayloadSchema = z.object({
  items: z.array(cartItemSchema).min(1, "No items in cart"),
  customerInfo: customerInfoSchema,
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
