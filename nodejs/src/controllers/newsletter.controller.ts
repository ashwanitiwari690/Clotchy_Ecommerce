import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

const SINGLETON_ID = "singleton";

// NewsletterConfig is a singleton - one row for the whole storefront's
// newsletter section, addressed with a fixed id rather than a list of
// resources. GET upserts an empty row so the storefront always gets a
// config to render, even before any admin has edited it.
export const getNewsletterConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await prisma.newsletterConfig.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });
  res.json({ success: true, data: config });
});

export const updateNewsletterConfig = asyncHandler(async (req: Request, res: Response) => {
  const config = await prisma.newsletterConfig.upsert({
    where: { id: SINGLETON_ID },
    update: req.body,
    create: { id: SINGLETON_ID, ...req.body },
  });
  res.json({ success: true, data: config });
});
