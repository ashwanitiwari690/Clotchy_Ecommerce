import { z } from "zod";

export const createMarketingBannerSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    image: z.string().trim().max(2000).optional(),
    link: z.string().trim().max(500).optional(),
    position: z.enum(["top", "sidebar", "popup"]).default("top"),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateMarketingBannerSchema = z.object({
  body: createMarketingBannerSchema.shape.body.partial(),
});
