import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const withProductCount = <T extends { _count: { products: number } }>({ _count, ...rest }: T) => ({
  ...rest,
  productCount: _count.products,
});

export const listCollections = asyncHandler(async (req: Request, res: Response) => {
  const { status, featured, search } = req.query as { status?: string; featured?: string; search?: string };

  const collections = await prisma.collection.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(featured !== undefined ? { featured: featured === "true" } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  res.json({ success: true, data: collections.map(withProductCount) });
});

export const getCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await prisma.collection.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { products: true } } },
  });
  if (!collection) throw ApiError.notFound("Collection not found");
  res.json({ success: true, data: withProductCount(collection) });
});

export const createCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await prisma.collection.create({ data: req.body });
  res.status(201).json({ success: true, data: { ...collection, productCount: 0 } });
});

export const updateCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await prisma.collection
    .update({ where: { id: req.params.id }, data: req.body, include: { _count: { select: { products: true } } } })
    .catch(() => null);
  if (!collection) throw ApiError.notFound("Collection not found");
  res.json({ success: true, data: withProductCount(collection) });
});

export const deleteCollection = asyncHandler(async (req: Request, res: Response) => {
  await prisma.collection.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Collection not found");
  });
  res.status(204).send();
});
