import { z } from "zod";

export const createDiscountSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(160),
    type: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().positive(),
    appliesTo: z.enum(["all", "category", "product"]).default("all"),
    targetId: z.string().uuid().nullable().optional(),
    targetName: z.string().trim().max(160).nullable().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateDiscountSchema = z.object({
  body: createDiscountSchema.shape.body.partial(),
});
