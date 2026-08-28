import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listBrands = asyncHandler(async (req: Request, res: Response) => {
  const { status, search } = req.query as { status?: string; search?: string };

  const brands = await prisma.brand.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { name: "asc" },
  });

  res.json({ success: true, data: brands });
});

export const getBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await prisma.brand.findUnique({ where: { id: req.params.id } });
  if (!brand) throw ApiError.notFound("Brand not found");
  res.json({ success: true, data: brand });
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await prisma.brand.create({ data: req.body });
  res.status(201).json({ success: true, data: brand });
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await prisma.brand.update({ where: { id: req.params.id }, data: req.body }).catch(() => null);
  if (!brand) throw ApiError.notFound("Brand not found");
  res.json({ success: true, data: brand });
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  await prisma.brand.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Brand not found");
  });
  res.status(204).send();
});
