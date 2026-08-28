import { z } from "zod";

export const updateCustomerSchema = z.object({
  body: z.object({
    status: z.enum(["active", "inactive", "blocked"]).optional(),
    groupId: z.string().uuid().nullable().optional(),
  }),
});
