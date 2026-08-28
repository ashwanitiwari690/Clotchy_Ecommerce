import { z } from "zod";

export const createHomePromotionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(2000).optional(),
    bannerImage: z.string().trim().max(2000).optional(),
    buttonText: z.string().trim().max(60).optional(),
    buttonUrl: z.string().trim().max(500).optional(),
    discount: z.string().trim().max(40).optional(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateHomePromotionSchema = z.object({
  body: createHomePromotionSchema.shape.body.partial(),
});
