import { z } from "zod";

export const moveFaqSchema = z.object({ body: z.object({ direction: z.enum(["up", "down"]) }) });

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string().trim().min(5).max(300),
    answer: z.string().trim().min(5).max(3000),
    category: z.string().trim().max(80).optional(),
    displayOrder: z.coerce.number().int().default(0),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateFaqSchema = z.object({
  body: createFaqSchema.shape.body.partial(),
});
