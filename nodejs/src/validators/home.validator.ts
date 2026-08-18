import { z } from "zod";

const statusSchema = z.enum(["active", "inactive"]).default("active");
const moveBody = z.object({ body: z.object({ direction: z.enum(["up", "down"]) }) });

export const moveHeroSchema = moveBody;
export const moveHomeCategorySchema = moveBody;
export const moveHomeCollectionSchema = moveBody;
export const moveBestSellerSchema = moveBody;
export const moveCommunityImageSchema = moveBody;

export const createHeroSchema = z.object({
  body: z.object({
    heading: z.string().trim().min(1).max(200),
    subheading: z.string().trim().max(200).optional(),
    description: z.string().trim().max(1000).optional(),
    desktopImage: z.string().trim().max(2000).optional(),
    mobileImage: z.string().trim().max(2000).optional(),
    primaryButtonText: z.string().trim().max(60).optional(),
    primaryButtonLink: z.string().trim().max(300).optional(),
    secondaryButtonText: z.string().trim().max(60).optional(),
    secondaryButtonLink: z.string().trim().max(300).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: statusSchema,
    displayOrder: z.coerce.number().int().default(0),
  }),
});
export const updateHeroSchema = z.object({ body: createHeroSchema.shape.body.partial() });

export const createHomeCategorySchema = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    displayOrder: z.coerce.number().int().default(0),
    status: statusSchema,
  }),
});
export const updateHomeCategorySchema = z.object({ body: createHomeCategorySchema.shape.body.partial() });

export const createHomeCollectionSchema = z.object({
  body: z.object({
    collectionId: z.string().uuid(),
    shortDescription: z.string().trim().max(300).optional(),
    link: z.string().trim().max(300).optional(),
    displayOrder: z.coerce.number().int().default(0),
    status: statusSchema,
  }),
});
export const updateHomeCollectionSchema = z.object({ body: createHomeCollectionSchema.shape.body.partial() });

export const createBestSellerSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    displayOrder: z.coerce.number().int().default(0),
    status: statusSchema,
  }),
});
export const updateBestSellerSchema = z.object({ body: createBestSellerSchema.shape.body.partial() });

export const createCommunityImageSchema = z.object({
  body: z.object({
    image: z.string().trim().min(1).max(2000),
    title: z.string().trim().max(120).optional(),
    description: z.string().trim().max(500).optional(),
    socialUrl: z.string().trim().max(300).optional(),
    displayOrder: z.coerce.number().int().default(0),
    status: statusSchema,
  }),
});
export const updateCommunityImageSchema = z.object({ body: createCommunityImageSchema.shape.body.partial() });
