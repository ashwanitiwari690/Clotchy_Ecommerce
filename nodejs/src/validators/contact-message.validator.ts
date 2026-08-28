import { z } from "zod";

export const createContactMessageSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    subject: z.string().trim().max(200).optional().default("Website contact form"),
    message: z.string().trim().min(5).max(3000),
  }),
});

export const updateContactMessageSchema = z.object({
  body: z.object({
    status: z.enum(["new", "read", "replied", "closed"]),
  }),
});
