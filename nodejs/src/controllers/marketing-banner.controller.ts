import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listMarketingBanners = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };

  const banners = await prisma.marketingBanner.findMany({
    where: {
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: banners });
});

export const getMarketingBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await prisma.marketingBanner.findUnique({ where: { id: req.params.id } });
  if (!banner) throw ApiError.notFound("Marketing banner not found");
  res.json({ success: true, data: banner });
});

export const createMarketingBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await prisma.marketingBanner.create({ data: req.body });
  res.status(201).json({ success: true, data: banner });
});

export const updateMarketingBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await prisma.marketingBanner
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!banner) throw ApiError.notFound("Marketing banner not found");
  res.json({ success: true, data: banner });
});

export const deleteMarketingBanner = asyncHandler(async (req: Request, res: Response) => {
  await prisma.marketingBanner.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Marketing banner not found");
  });
  res.status(204).send();
});
