import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listDiscounts = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };

  const discounts = await prisma.discount.findMany({
    where: {
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: discounts });
});

export const getDiscount = asyncHandler(async (req: Request, res: Response) => {
  const discount = await prisma.discount.findUnique({ where: { id: req.params.id } });
  if (!discount) throw ApiError.notFound("Discount not found");
  res.json({ success: true, data: discount });
});

export const createDiscount = asyncHandler(async (req: Request, res: Response) => {
  const discount = await prisma.discount.create({ data: req.body });
  res.status(201).json({ success: true, data: discount });
});

export const updateDiscount = asyncHandler(async (req: Request, res: Response) => {
  const discount = await prisma.discount
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!discount) throw ApiError.notFound("Discount not found");
  res.json({ success: true, data: discount });
});

export const deleteDiscount = asyncHandler(async (req: Request, res: Response) => {
  await prisma.discount.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Discount not found");
  });
  res.status(204).send();
});
