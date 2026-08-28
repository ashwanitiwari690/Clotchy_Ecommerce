import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listHomePromotions = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };

  const promotions = await prisma.homePromotion.findMany({
    where: { ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: promotions });
});

export const getHomePromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.homePromotion.findUnique({ where: { id: req.params.id } });
  if (!promotion) throw ApiError.notFound("Home promotion not found");
  res.json({ success: true, data: promotion });
});

export const createHomePromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.homePromotion.create({ data: req.body });
  res.status(201).json({ success: true, data: promotion });
});

export const updateHomePromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.homePromotion
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!promotion) throw ApiError.notFound("Home promotion not found");
  res.json({ success: true, data: promotion });
});

export const deleteHomePromotion = asyncHandler(async (req: Request, res: Response) => {
  await prisma.homePromotion.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Home promotion not found");
  });
  res.status(204).send();
});
