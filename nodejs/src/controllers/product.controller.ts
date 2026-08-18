import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// Public catalog reads are safe to cache briefly at the browser/CDN level - the
// catalog doesn't change second-to-second, and stale-while-revalidate means
// repeat visits within the window skip the network round-trip entirely while
// still refreshing in the background.
const PUBLIC_CACHE_CONTROL = "public, max-age=30, stale-while-revalidate=120";

const PRODUCT_INCLUDE = {
  category: true,
  collections: true,
  variants: true,
} satisfies Prisma.ProductInclude;

const SORT_MAP: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  rating: { rating: "desc" },
  newest: { createdAt: "desc" },
};

const isAdmin = (req: Request) => req.user?.role === "ADMIN";

const buildWhere = (req: Request): Prisma.ProductWhereInput => {
  const { category, collection, search, status } = req.query as Record<string, string | undefined>;
  const where: Prisma.ProductWhereInput = {};

  if (isAdmin(req)) {
    if (status) where.status = status;
  } else {
    where.status = "published";
  }

  if (category) where.category = { slug: category };
  if (collection) where.collections = { some: { slug: collection } };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  return where;
};

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Number(req.query.pageSize) || 20);
  const sort = typeof req.query.sort === "string" ? SORT_MAP[req.query.sort] : undefined;
  const where = buildWhere(req);

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sort ?? { createdAt: "desc" },
      include: PRODUCT_INCLUDE,
    }),
    prisma.product.count({ where }),
  ]);

  res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
  res.json({ success: true, data: items, meta: { page, pageSize, total } });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: PRODUCT_INCLUDE,
  });
  if (!product) throw ApiError.notFound("Product not found");
  res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
  res.json({ success: true, data: product });
});

interface ProductPayload {
  collectionIds?: string[];
  variants?: { size?: string; color?: string; material?: string; sku: string; price: number; stock: number }[];
  [key: string]: unknown;
}

const splitPayload = (body: ProductPayload) => {
  const { collectionIds, variants, ...rest } = body;
  return { rest, collectionIds, variants };
};

const handleKnownErrors = (err: unknown): never => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") throw ApiError.conflict("A product with this slug or SKU already exists");
    if (err.code === "P2025") throw ApiError.notFound("Product not found");
  }
  throw err;
};

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { rest, collectionIds, variants } = splitPayload(req.body);

  const product = await prisma.product
    .create({
      data: {
        ...(rest as Prisma.ProductUncheckedCreateInput),
        collections: collectionIds ? { connect: collectionIds.map((id) => ({ id })) } : undefined,
        variants: variants && variants.length > 0 ? { create: variants } : undefined,
      },
      include: PRODUCT_INCLUDE,
    })
    .catch(handleKnownErrors);

  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { rest, collectionIds, variants } = splitPayload(req.body);

  const product = await prisma
    .$transaction(async (tx) => {
      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: req.params.id } });
      }
      return tx.product.update({
        where: { id: req.params.id },
        data: {
          ...(rest as Prisma.ProductUncheckedUpdateInput),
          collections: collectionIds ? { set: collectionIds.map((id) => ({ id })) } : undefined,
          variants: variants && variants.length > 0 ? { create: variants } : undefined,
        },
        include: PRODUCT_INCLUDE,
      });
    })
    .catch(handleKnownErrors);

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await prisma.product.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Product not found");
  });
  res.status(204).send();
});
