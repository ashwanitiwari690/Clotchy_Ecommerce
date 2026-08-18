import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// Mirrors the storefront cart's existing free-shipping rule (cart.service.ts) -
// checkout has to compute the same total the cart displayed, server-side.
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export const toOrderDto = (order: OrderWithItems) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  customerId: order.userId,
  customerName: order.customerName,
  email: order.email,
  phone: order.phone,
  address: [order.addressLine1, order.addressLine2, order.city, order.state, order.pincode]
    .filter(Boolean)
    .join(", "),
  date: order.createdAt,
  items: order.items.map((i) => ({
    productId: i.productId,
    productName: i.productName,
    image: i.image,
    variant: i.variant ?? undefined,
    quantity: i.quantity,
    price: Number(i.price),
  })),
  subtotal: Number(order.subtotal),
  discount: Number(order.discount),
  shipping: Number(order.shipping),
  tax: Number(order.tax),
  total: Number(order.total),
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  status: order.status,
});

interface CheckoutLine {
  productId: string;
  size?: string;
  color?: string;
  quantity: number;
}

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: CheckoutLine[] };
  const userId = req.user!.id;

  const order = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, include: { address: true } });
    if (!user) throw ApiError.unauthorized();
    if (!user.address) throw ApiError.badRequest("Add a shipping address before placing an order");

    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];
    let subtotal = 0;

    for (const line of items) {
      const product = await tx.product.findUnique({ where: { id: line.productId }, include: { variants: true } });
      if (!product || product.status !== "published") {
        throw ApiError.badRequest(`Product ${line.productId} is not available`);
      }

      const variant =
        line.size || line.color
          ? product.variants.find((v) => (!line.size || v.size === line.size) && (!line.color || v.color === line.color))
          : undefined;

      const availableStock = variant ? variant.stock : product.stock;
      if (availableStock < line.quantity && !product.allowBackorder) {
        throw ApiError.badRequest(`Not enough stock for "${product.name}"`);
      }

      const price = Number(variant?.price ?? product.salePrice ?? product.price);
      subtotal += price * line.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        image: product.mainImage,
        variant: variant ? [variant.size, variant.color].filter(Boolean).join(" / ") || null : null,
        quantity: line.quantity,
        price,
      });

      if (variant) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: Math.max(0, variant.stock - line.quantity) },
        });
      } else {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: Math.max(0, product.stock - line.quantity) },
        });
      }
      await tx.product.update({
        where: { id: product.id },
        data: { unitsSold: { increment: line.quantity }, revenue: { increment: price * line.quantity } },
      });
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;
    const orderNumber = `CLT-${Date.now().toString(36).toUpperCase()}`;

    return tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName: user.name,
        email: user.email ?? "",
        phone: user.phone,
        addressLine1: user.address.line1,
        addressLine2: user.address.line2,
        city: user.address.city,
        state: user.address.state,
        pincode: user.address.pincode,
        country: user.address.country,
        subtotal,
        shipping,
        total,
        items: { createMany: { data: orderItems } },
      },
      include: { items: true },
    });
  });

  res.status(201).json({ success: true, data: toOrderDto(order) });
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === "ADMIN";
  const { status, search, page: pageQ, pageSize: pageSizeQ } = req.query as Record<string, string | undefined>;
  const page = Math.max(1, Number(pageQ) || 1);
  const pageSize = Math.min(50, Number(pageSizeQ) || 20);

  const where: Prisma.OrderWhereInput = {
    ...(isAdmin ? {} : { userId: req.user!.id }),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ success: true, data: orders.map(toOrderDto), meta: { page, pageSize, total } });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!order) throw ApiError.notFound("Order not found");
  if (req.user!.role !== "ADMIN" && order.userId !== req.user!.id) throw ApiError.forbidden();
  res.json({ success: true, data: toOrderDto(order) });
});

export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderNumber, phone } = req.query as { orderNumber?: string; phone?: string };
  if (!orderNumber || !phone) throw ApiError.badRequest("Order number and phone are required");

  const order = await prisma.order.findFirst({ where: { orderNumber, phone }, include: { items: true } });
  if (!order) throw ApiError.notFound("No order found matching that order number and phone number");
  res.json({ success: true, data: toOrderDto(order) });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order
    .update({ where: { id: req.params.id }, data: { status: req.body.status }, include: { items: true } })
    .catch(() => null);
  if (!order) throw ApiError.notFound("Order not found");
  res.json({ success: true, data: toOrderDto(order) });
});
