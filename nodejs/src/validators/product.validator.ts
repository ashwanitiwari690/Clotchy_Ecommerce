import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be URL-safe (lowercase, numbers, hyphens)"),
    description: z.string().trim().max(2000).optional(),
    price: z.coerce.number().positive("Price must be greater than 0"),
    stock: z.coerce.number().int().nonnegative().default(0),
    categoryId: z.string().uuid().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});
