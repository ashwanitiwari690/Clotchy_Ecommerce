import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be URL-safe (lowercase, numbers, hyphens)"),
    description: z.string().trim().max(2000).optional(),
    image: z.string().trim().max(2000).optional(),
    sortOrder: z.coerce.number().int().default(0),
    status: z.enum(["active", "inactive"]).default("active"),
    parentId: z.string().uuid().nullable().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
});
