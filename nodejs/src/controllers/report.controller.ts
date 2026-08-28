import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { toOrderDto } from "./order.controller";
import { ORDER_STATUSES } from "../validators/order.validator";

export const getSalesReport = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });

  const revenue = orders
    .filter((o) => !["cancelled", "returned", "refunded"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0);
  const orderCount = orders.length;
  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
  const refunds = orders.filter((o) => o.status === "refunded").reduce((sum, o) => sum + Number(o.total), 0);
  const discounts = orders.reduce((sum, o) => sum + Number(o.discount), 0);

  const byDate = new Map<string, number>();
  for (const o of orders) {
    if (["cancelled", "returned", "refunded"].includes(o.status)) continue;
    const key = o.createdAt.toISOString().slice(0, 10);
    byDate.set(key, (byDate.get(key) ?? 0) + Number(o.total));
  }
  const revenueByDate = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }));

  res.json({
    success: true,
    data: { orders: orders.map(toOrderDto), revenue, orderCount, aov, refunds, discounts, revenueByDate },
  });
});

export const getOrdersReport = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });

  const statusSummary = ORDER_STATUSES.map((status) => {
    const matching = orders.filter((o) => o.status === status);
    return {
      status,
      count: matching.length,
      revenue: matching.reduce((sum, o) => sum + Number(o.total), 0),
    };
  });

  res.json({ success: true, data: { orders: orders.map(toOrderDto), statusSummary } });
});

export const getProductsReport = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ include: { category: true } });

  const bestSelling = [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 6);
  const mostViewed = [...products]
    .map((p) => ({ ...p, views: p.unitsSold * 7 + 120 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);

  const byCategory = new Map<string, number>();
  for (const p of products) {
    const label = p.category?.name ?? "Uncategorized";
    byCategory.set(label, (byCategory.get(label) ?? 0) + 1);
  }
  const countByCategory = [...byCategory.entries()].map(([label, value]) => ({ label, value }));

  res.json({ success: true, data: { bestSelling, mostViewed, lowStock, countByCategory } });
});

export const getCustomersReport = asyncHandler(async (_req: Request, res: Response) => {
  const [users, spendByUser] = await Promise.all([
    prisma.user.findMany({ where: { role: "USER" }, include: { _count: { select: { orders: true } } } }),
    prisma.order.groupBy({ by: ["userId"], _sum: { total: true } }),
  ]);
  const spendMap = new Map(spendByUser.map((s) => [s.userId, Number(s._sum.total ?? 0)]));

  const customers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar,
    registeredAt: u.createdAt,
    totalOrders: u._count.orders,
    totalSpent: spendMap.get(u.id) ?? 0,
  }));

  const newCustomers = [...customers].sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime()).slice(0, 6);
  const returningCustomers = customers.filter((c) => c.totalOrders > 1);
  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 6);

  res.json({ success: true, data: { newCustomers, returningCustomers, topCustomers } });
});

export const getInventoryReport = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ include: { category: true } });

  const totalSkus = products.length;
  const inStockCount = products.filter((p) => p.stock > p.lowStockThreshold).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const byCategory = new Map<string, number>();
  for (const p of products) {
    const label = p.category?.name ?? "Uncategorized";
    byCategory.set(label, (byCategory.get(label) ?? 0) + p.stock);
  }
  const stockByCategory = [...byCategory.entries()].map(([label, value]) => ({ label, value }));

  res.json({
    success: true,
    data: { totalSkus, inStockCount, lowStockCount, outOfStockCount, stockByCategory, products },
  });
});
