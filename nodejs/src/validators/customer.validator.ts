import { z } from "zod";

export const updateCustomerStatusSchema = z.object({
  body: z.object({
    status: z.enum(["active", "inactive", "blocked"]),
  }),
});
