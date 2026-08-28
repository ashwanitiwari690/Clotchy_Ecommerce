import { z } from "zod";

export const moveTestimonialSchema = z.object({ body: z.object({ direction: z.enum(["up", "down"]) }) });

export const createTestimonialSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(2).max(120),
    customerImage: z.string().trim().max(2000).optional(),
    rating: z.coerce.number().int().min(1).max(5),
    review: z.string().trim().min(5).max(2000),
    date: z.coerce.date().optional(),
    status: z.enum(["approved", "pending", "hidden"]).default("pending"),
    displayOrder: z.coerce.number().int().default(0),
  }),
});

export const updateTestimonialSchema = z.object({
  body: createTestimonialSchema.shape.body.partial(),
});
