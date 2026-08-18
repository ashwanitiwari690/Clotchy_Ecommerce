import { z } from "zod";

export const adjustStockSchema = z.object({
  body: z.object({
    delta: z.coerce.number().int(),
    note: z.string().trim().max(300).optional(),
  }),
});

export const bulkUpdateStockSchema = z.object({
  body: z
    .array(
      z.object({
        productId: z.string().uuid(),
        availableStock: z.coerce.number().int().nonnegative(),
      }),
    )
    .min(1),
});
