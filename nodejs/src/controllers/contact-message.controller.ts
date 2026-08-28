import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };

  const messages = await prisma.contactMessage.findMany({
    where: { ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: messages });
});

export const getContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
  if (!message) throw ApiError.notFound("Contact message not found");
  res.json({ success: true, data: message });
});

export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await prisma.contactMessage.create({ data: { ...req.body, status: "new" } });
  res.status(201).json({ success: true, data: message });
});

export const updateContactMessageStatus = asyncHandler(async (req: Request, res: Response) => {
  const message = await prisma.contactMessage
    .update({ where: { id: req.params.id }, data: { status: req.body.status } })
    .catch(() => null);
  if (!message) throw ApiError.notFound("Contact message not found");
  res.json({ success: true, data: message });
});
