import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { toOrderDto } from "./order.controller";

const REVENUE_EXCLUDED_STATUSES = ["cancelled", "returned", "refunded"];

const STATUS_BUCKETS: { label: string; color: string; statuses: string[] }[] = [
  { label: "Pending", color: "#f9b115", statuses: ["pending", "confirmed"] },
  { label: "Processing", color: "#3399ff", statuses: ["processing", "packed"] },
  { label: "Shipped", color: "#20a8d8", statuses: ["shipped", "out-for-delivery"] },
  { label: "Delivered", color: "#2eb85c", statuses: ["delivered"] },
  { label: "Cancelled", color: "#e55353", statuses: ["cancelled", "returned", "refunded"] },
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Builds the revenue/order-count trend line for the dashboard's main chart.
// Buckets are computed in JS over an already-fetched, already-filtered order
// list rather than N separate SQL queries - simplest correct approach at the
// order volumes this admin panel deals with.
const buildTrend = (period: string, orders: { total: unknown; createdAt: Date }[]) => {
  const now = new Date();
  let bucketCount: number;
  let keyOf: (d: Date) => string;
  let labelOf: (key: string) => string;
  let rangeStart: Date;

  if (period === "today") {
    bucketCount = 12;
    rangeStart = new Date(now);
    rangeStart.setHours(0, 0, 0, 0);
    keyOf = (d) => String(Math.floor(d.getHours() / 2));
    labelOf = (key) => {
      const hour = Number(key) * 2;
      const ampm = hour < 12 ? "AM" : "PM";
      const display = hour % 12 === 0 ? 12 : hour % 12;
      return `${display} ${ampm}`;
    };
  } else if (period === "week") {
    bucketCount = 7;
    rangeStart = new Date(now);
    rangeStart.setDate(now.getDate() - 6);
    rangeStart.setHours(0, 0, 0, 0);
    keyOf = (d) => d.toISOString().slice(0, 10);
    labelOf = (key) => WEEKDAY_LABELS[new Date(key).getDay()];
  } else if (period === "year") {
    bucketCount = 5;
    rangeStart = new Date(now.getFullYear() - 4, 0, 1);
    keyOf = (d) => String(d.getFullYear());
    labelOf = (key) => key;
  } else {
    bucketCount = 12;
    rangeStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    keyOf = (d) => `${d.getFullYear()}-${d.getMonth()}`;
    labelOf = (key) => MONTH_LABELS[Number(key.split("-")[1])];
  }

  const buckets: { key: string; label: string; revenue: number; orders: number }[] = [];
  if (period === "today") {
    for (let i = 0; i < bucketCount; i++) buckets.push({ key: String(i), label: labelOf(String(i)), revenue: 0, orders: 0 });
  } else if (period === "week") {
    for (let i = 0; i < bucketCount; i++) {
      const d = new Date(rangeStart);
      d.setDate(rangeStart.getDate() + i);
      const key = keyOf(d);
      buckets.push({ key, label: labelOf(key), revenue: 0, orders: 0 });
    }
  } else if (period === "year") {
    for (let i = 0; i < bucketCount; i++) {
      const key = String(rangeStart.getFullYear() + i);
      buckets.push({ key, label: labelOf(key), revenue: 0, orders: 0 });
    }
  } else {
    for (let i = 0; i < bucketCount; i++) {
      const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1);
      const key = keyOf(d);
      buckets.push({ key, label: labelOf(key), revenue: 0, orders: 0 });
    }
  }

  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const order of orders) {
    if (order.createdAt < rangeStart) continue;
    const key = keyOf(order.createdAt);
    const bucket = byKey.get(key);
    if (bucket) {
      bucket.revenue += Number(order.total);
      bucket.orders += 1;
    }
  }

  return {
    labels: buckets.map((b) => b.label),
    revenue: buckets.map((b) => Math.round(b.revenue)),
    orders: buckets.map((b) => b.orders),
  };
};

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const period = typeof req.query.period === "string" ? req.query.period : "month";
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    openTickets,
    revenueOrders,
    inStockProducts,
    categoriesWithRevenue,
    topSellingProducts,
    recentOrdersRaw,
    recentCustomers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: { in: ["pending", "confirmed"] } } }),
    prisma.ticket.count({ where: { status: { in: ["open", "in-progress"] } } }),
    prisma.order.findMany({
      where: { status: { notIn: REVENUE_EXCLUDED_STATUSES } },
      select: { total: true, createdAt: true },
    }),
    prisma.product.findMany({ where: { stock: { gt: 0 } } }),
    prisma.category.findMany({
      select: { id: true, name: true, products: { select: { revenue: true } } },
    }),
    prisma.product.findMany({ orderBy: { unitsSold: "desc" }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { orders: true } }, orders: { select: { total: true } } },
    }),
  ]);

  const lowStockProducts = inStockProducts.filter((p) => p.stock <= p.lowStockThreshold);

  const totalRevenue = revenueOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const todaysSales = revenueOrders
    .filter((o) => o.createdAt >= startOfToday)
    .reduce((sum, o) => sum + Number(o.total), 0);

  const statusCounts = await prisma.order.groupBy({ by: ["status"], _count: true });
  const countByStatus = new Map(statusCounts.map((s) => [s.status, s._count]));
  const orderStatusBuckets = STATUS_BUCKETS.map((b) => ({
    label: b.label,
    color: b.color,
    value: b.statuses.reduce((sum, s) => sum + (countByStatus.get(s) ?? 0), 0),
  }));

  const revenueByCategory = categoriesWithRevenue
    .map((c) => ({ label: c.name, value: c.products.reduce((sum, p) => sum + Number(p.revenue), 0) }))
    .sort((a, b) => b.value - a.value);

  const trend = buildTrend(period, revenueOrders);

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      todaysSales,
      openTickets,
      orderStatusBuckets,
      revenueByCategory,
      topSellingProducts,
      lowStockProducts,
      recentOrders: recentOrdersRaw.map(toOrderDto),
      recentCustomers: recentCustomers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: c.avatar,
        registeredAt: c.createdAt,
        totalOrders: c._count.orders,
        totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
      })),
      trend,
    },
  });
});
