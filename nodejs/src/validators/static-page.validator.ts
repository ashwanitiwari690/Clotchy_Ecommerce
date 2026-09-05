import { z } from "zod";

export const createStaticPageSchema = z.object({
  body: z.object({
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens")
      .min(2)
      .max(80),
    title: z.string().trim().min(2).max(150),
    content: z.string().trim().min(1).max(20000),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateStaticPageSchema = z.object({
  body: createStaticPageSchema.shape.body.partial(),
});
