import { z } from "zod";

const variantSchema = z.object({
  size: z.string().trim().max(40).optional(),
  color: z.string().trim().max(40).optional(),
  material: z.string().trim().max(40).optional(),
  sku: z.string().trim().min(1).max(80),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be URL-safe (lowercase, numbers, hyphens)"),
    sku: z.string().trim().min(1).max(80),
    description: z.string().trim().max(4000).optional(),
    shortDescription: z.string().trim().max(500).optional(),

    price: z.coerce.number().positive("Price must be greater than 0"),
    salePrice: z.coerce.number().positive().nullable().optional(),
    costPrice: z.coerce.number().nonnegative().nullable().optional(),
    taxPercent: z.coerce.number().min(0).max(100).default(0),
    discountPercent: z.coerce.number().min(0).max(100).default(0),

    stock: z.coerce.number().int().nonnegative().default(0),
    lowStockThreshold: z.coerce.number().int().nonnegative().default(5),
    availability: z.enum(["in-stock", "out-of-stock", "backorder"]).default("in-stock"),
    allowBackorder: z.coerce.boolean().default(false),

    categoryId: z.string().uuid().nullable().optional(),
    collectionIds: z.array(z.string().uuid()).default([]),
    tags: z.array(z.string().trim().min(1)).default([]),

    mainImage: z.string().trim().max(2000).optional(),
    thumbnail: z.string().trim().max(2000).optional(),
    gallery: z.array(z.string().trim().max(2000)).default([]),

    metaTitle: z.string().trim().max(200).optional(),
    metaDescription: z.string().trim().max(400).optional(),
    keywords: z.string().trim().max(300).optional(),

    status: z.enum(["draft", "published", "out-of-stock", "archived"]).default("draft"),
    featured: z.coerce.boolean().default(false),
    bestSeller: z.coerce.boolean().default(false),

    variants: z.array(variantSchema).default([]),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});
