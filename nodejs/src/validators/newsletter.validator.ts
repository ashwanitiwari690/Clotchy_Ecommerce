import { z } from "zod";

export const updateNewsletterConfigSchema = z.object({
  body: z.object({
    title: z.string().trim().max(160).optional(),
    description: z.string().trim().max(1000).optional(),
    backgroundImage: z.string().trim().max(2000).optional(),
    buttonText: z.string().trim().max(60).optional(),
    placeholderText: z.string().trim().max(120).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});
