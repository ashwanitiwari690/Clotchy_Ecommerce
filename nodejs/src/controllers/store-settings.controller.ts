import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getStoreSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  res.json({ success: true, data: settings });
});

export const updateStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: req.body,
    create: { id: "singleton", ...req.body },
  });
  res.json({ success: true, data: settings });
});
