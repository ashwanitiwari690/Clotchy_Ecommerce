import { z } from "zod";

export const createCollectionSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be URL-safe (lowercase, numbers, hyphens)"),
    description: z.string().trim().max(2000).optional(),
    image: z.string().trim().max(2000).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
    featured: z.coerce.boolean().default(false),
  }),
});

export const updateCollectionSchema = z.object({
  body: createCollectionSchema.shape.body.partial(),
});
