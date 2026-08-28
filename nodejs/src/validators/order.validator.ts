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
    couponCode: z.string().trim().toUpperCase().min(1).max(40).optional(),
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
