import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { toOrderDto } from "./order.controller";

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { search, status } = req.query as { search?: string; status?: string };

  const where: Prisma.UserWhereInput = {
    role: "USER",
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [users, spendByUser] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } }, address: true },
    }),
    prisma.order.groupBy({ by: ["userId"], _sum: { total: true } }),
  ]);

  const spendMap = new Map(spendByUser.map((s) => [s.userId, Number(s._sum.total ?? 0)]));

  res.json({
    success: true,
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      registeredAt: u.createdAt,
      groupId: u.groupId,
      status: u.status,
      totalOrders: u._count.orders,
      totalSpent: spendMap.get(u.id) ?? 0,
      addresses: u.address
        ? [
            {
              id: u.address.id,
              label: "Default",
              line1: u.address.line1,
              city: u.address.city,
              state: u.address.state,
              zip: u.address.pincode,
              country: u.address.country,
              isDefault: true,
            },
          ]
        : [],
    })),
  });
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, role: "USER" },
    include: {
      address: true,
      orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
      wishlist: { include: { product: true } },
    },
  });
  if (!user) throw ApiError.notFound("Customer not found");

  const totalSpent = user.orders.reduce((sum, o) => sum + Number(o.total), 0);

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      registeredAt: user.createdAt,
      groupId: user.groupId,
      status: user.status,
      totalOrders: user.orders.length,
      totalSpent,
      addresses: user.address
        ? [
            {
              id: user.address.id,
              label: "Default",
              line1: user.address.line1,
              city: user.address.city,
              state: user.address.state,
              zip: user.address.pincode,
              country: user.address.country,
              isDefault: true,
            },
          ]
        : [],
      wishlistProductIds: user.wishlist.map((w) => w.productId),
      orders: user.orders.map(toOrderDto),
    },
  });
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { status, groupId } = req.body as { status?: string; groupId?: string | null };
  const user = await prisma.user
    .update({ where: { id: req.params.id }, data: { ...(status ? { status } : {}), ...(groupId !== undefined ? { groupId } : {}) } })
    .catch(() => null);
  if (!user) throw ApiError.notFound("Customer not found");
  res.json({ success: true, data: { id: user.id, status: user.status, groupId: user.groupId } });
});
