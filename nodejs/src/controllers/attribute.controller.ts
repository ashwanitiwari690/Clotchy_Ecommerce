import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listAttributes = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query as { search?: string };

  const attributes = await prisma.productAttribute.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { name: "asc" },
  });

  res.json({ success: true, data: attributes });
});

export const getAttribute = asyncHandler(async (req: Request, res: Response) => {
  const attribute = await prisma.productAttribute.findUnique({ where: { id: req.params.id } });
  if (!attribute) throw ApiError.notFound("Attribute not found");
  res.json({ success: true, data: attribute });
});

export const createAttribute = asyncHandler(async (req: Request, res: Response) => {
  const attribute = await prisma.productAttribute.create({ data: req.body });
  res.status(201).json({ success: true, data: attribute });
});

export const updateAttribute = asyncHandler(async (req: Request, res: Response) => {
  const attribute = await prisma.productAttribute
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!attribute) throw ApiError.notFound("Attribute not found");
  res.json({ success: true, data: attribute });
});

export const deleteAttribute = asyncHandler(async (req: Request, res: Response) => {
  await prisma.productAttribute.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Attribute not found");
  });
  res.status(204).send();
});
