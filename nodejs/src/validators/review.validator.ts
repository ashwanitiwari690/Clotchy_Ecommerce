import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(5).max(2000),
  }),
});

export const updateReviewStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"]),
  }),
});
