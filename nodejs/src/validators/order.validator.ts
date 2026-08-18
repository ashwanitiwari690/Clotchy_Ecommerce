import { z } from "zod";

export const checkoutSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          size: z.string().trim().max(40).optional(),
          color: z.string().trim().max(40).optional(),
          quantity: z.coerce.number().int().positive(),
        }),
      )
      .min(1),
  }),
});

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
] as const;

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(ORDER_STATUSES),
  }),
});
