import { z } from "zod";

export const updateStoreSettingsSchema = z.object({
  body: z.object({
    storeName: z.string().trim().max(160).optional(),
    logo: z.string().trim().max(2000).optional(),
    favicon: z.string().trim().max(2000).optional(),
    contactEmail: z.string().trim().email().optional(),
    contactPhone: z.string().trim().max(20).optional(),
    address: z.string().trim().max(500).optional(),
    shippingMethods: z
      .array(z.object({ name: z.string().trim().min(1), charge: z.coerce.number().nonnegative() }))
      .optional(),
    freeShippingThreshold: z.coerce.number().nonnegative().optional(),
    paymentMethods: z.array(z.string()).optional(),
    currency: z.string().trim().max(10).optional(),
    taxName: z.string().trim().max(40).optional(),
    taxRate: z.coerce.number().min(0).max(100).optional(),
    pricesIncludeTax: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
    orderNotifications: z.boolean().optional(),
    customerNotifications: z.boolean().optional(),
    instagram: z.string().trim().max(300).optional(),
    facebook: z.string().trim().max(300).optional(),
    youtube: z.string().trim().max(300).optional(),
    twitter: z.string().trim().max(300).optional(),
  }),
});
