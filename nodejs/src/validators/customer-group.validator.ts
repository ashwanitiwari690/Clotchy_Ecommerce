import { z } from "zod";

export const createCustomerGroupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().max(500).optional(),
  }),
});

export const updateCustomerGroupSchema = z.object({
  body: createCustomerGroupSchema.shape.body.partial(),
});
