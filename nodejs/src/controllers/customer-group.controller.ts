import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const withCustomerCount = <T extends { _count: { members: number } }>({ _count, ...rest }: T) => ({
  ...rest,
  customerCount: _count.members,
});

export const listCustomerGroups = asyncHandler(async (_req: Request, res: Response) => {
  const groups = await prisma.customerGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { members: true } } },
  });

  res.json({ success: true, data: groups.map(withCustomerCount) });
});

export const getCustomerGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await prisma.customerGroup.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { members: true } } },
  });
  if (!group) throw ApiError.notFound("Customer group not found");
  res.json({ success: true, data: withCustomerCount(group) });
});

export const createCustomerGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await prisma.customerGroup.create({ data: req.body });
  res.status(201).json({ success: true, data: { ...group, customerCount: 0 } });
});

export const updateCustomerGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await prisma.customerGroup
    .update({ where: { id: req.params.id }, data: req.body, include: { _count: { select: { members: true } } } })
    .catch(() => null);
  if (!group) throw ApiError.notFound("Customer group not found");
  res.json({ success: true, data: withCustomerCount(group) });
});

export const deleteCustomerGroup = asyncHandler(async (req: Request, res: Response) => {
  await prisma.customerGroup.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Customer group not found");
  });
  res.status(204).send();
});
