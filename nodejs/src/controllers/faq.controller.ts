import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { buildOrderedHandlers } from "./home.controller";

export const faq = buildOrderedHandlers(prisma.faq, "FAQ not found", "Duplicate FAQ");

export const getFaq = asyncHandler(async (req: Request, res: Response) => {
  const faq = await prisma.faq.findUnique({ where: { id: req.params.id } });
  if (!faq) throw ApiError.notFound("FAQ not found");
  res.json({ success: true, data: faq });
});
