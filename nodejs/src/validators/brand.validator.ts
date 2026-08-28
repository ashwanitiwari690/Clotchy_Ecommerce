import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be URL-safe (lowercase, numbers, hyphens)"),
    logo: z.string().trim().max(2000).optional(),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateBrandSchema = z.object({
  body: createBrandSchema.shape.body.partial(),
});
