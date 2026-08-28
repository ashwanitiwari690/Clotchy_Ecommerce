import { z } from "zod";

export const createAttributeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    values: z.array(z.string().trim().min(1)).default([]),
  }),
});

export const updateAttributeSchema = z.object({
  body: createAttributeSchema.shape.body.partial(),
});
