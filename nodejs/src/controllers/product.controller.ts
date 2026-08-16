import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// Public catalog reads are safe to cache briefly at the browser/CDN level - the
// catalog doesn't change second-to-second, and stale-while-revalidate means
// repeat visits within the window skip the network round-trip entirely while
// still refreshing in the background.
const PUBLIC_CACHE_CONTROL = "public, max-age=30, stale-while-revalidate=120";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Number(req.query.pageSize) || 20);

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: { isActive: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
  res.json({ success: true, data: items, meta: { page, pageSize, total } });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!product) throw ApiError.notFound("Product not found");
  res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!product) throw ApiError.notFound("Product not found");
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await prisma.product.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Product not found");
  });
  res.status(204).send();
});
