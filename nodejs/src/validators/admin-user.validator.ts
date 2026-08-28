import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const createAdminUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    phone: phoneSchema,
    email: z.string().trim().email().optional(),
    password: z.string().min(8).max(72),
  }),
});

export const updateAdminUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    email: z.string().trim().email().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});
