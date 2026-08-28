import { z } from "zod";

export const createCouponSchema = z.object({
  body: z.object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9-]+$/, "Code must be letters, numbers, and hyphens only")
      .min(3)
      .max(40),
    discountType: z.enum(["percentage", "fixed", "free-shipping"]),
    discountValue: z.coerce.number().nonnegative().default(0),
    minOrder: z.coerce.number().nonnegative().default(0),
    maxDiscount: z.coerce.number().positive().nullable().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    usageLimit: z.coerce.number().int().nonnegative().default(0),
    status: z.enum(["active", "inactive", "expired"]).default("active"),
  }),
});

export const updateCouponSchema = z.object({
  body: createCouponSchema.shape.body.partial(),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().trim().toUpperCase().min(1),
    subtotal: z.coerce.number().nonnegative(),
  }),
});
