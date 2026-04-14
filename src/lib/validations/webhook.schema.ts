import { z } from "zod";

export const webhookPayloadSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
  }),
  action: z.string().optional(),
  api_version: z.string().optional(),
  date_created: z.string().optional(),
  id: z.union([z.string(), z.number()]).optional(),
  live_mode: z.boolean().optional(),
  user_id: z.union([z.string(), z.number()]).optional(),
});

export type WebhookPayloadInput = z.infer<typeof webhookPayloadSchema>;
