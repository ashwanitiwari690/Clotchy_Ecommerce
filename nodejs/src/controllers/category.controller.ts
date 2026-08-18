import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const withProductCount = <T extends { _count: { products: number } }>({ _count, ...rest }: T) => ({
  ...rest,
  productCount: _count.products,
});

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const { status, search } = req.query as { status?: string; search?: string };

  const categories = await prisma.category.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  res.json({ success: true, data: categories.map(withProductCount) });
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) throw ApiError.notFound("Category not found");
  res.json({ success: true, data: withProductCount(category) });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.create({ data: req.body });
  res.status(201).json({ success: true, data: { ...category, productCount: 0 } });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category
    .update({ where: { id: req.params.id }, data: req.body, include: { _count: { select: { products: true } } } })
    .catch(() => null);
  if (!category) throw ApiError.notFound("Category not found");
  res.json({ success: true, data: withProductCount(category) });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await prisma.category.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Category not found");
  });
  res.status(204).send();
});
