import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  mainImage: string | null;
  thumbnail: string | null;
  category: { name: string } | null;
  _count: { movements: number };
}

// Stock counted as "reserved" is whatever's tied up in orders that haven't
// shipped yet - once an order is shipped/delivered/cancelled/etc. it no longer
// holds a claim on inventory.
const RESERVED_STATUSES = ["pending", "confirmed", "processing", "packed"];

const serialize = (product: InventoryProduct, reservedStock: number) => ({
  productId: product.id,
  productName: product.name,
  sku: product.sku,
  thumbnail: product.thumbnail ?? product.mainImage,
  categoryName: product.category?.name ?? null,
  availableStock: product.stock,
  reservedStock,
  lowStockThreshold: product.lowStockThreshold,
  movementCount: product._count.movements,
});

const getReservedStockMap = async (productIds?: string[]): Promise<Map<string, number>> => {
  const reserved = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      productId: productIds ? { in: productIds } : { not: null },
      order: { status: { in: RESERVED_STATUSES } },
    },
    _sum: { quantity: true },
  });
  return new Map(reserved.filter((r) => r.productId).map((r) => [r.productId as string, r._sum.quantity ?? 0]));
};

export const listInventory = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query as { search?: string };

  const products = await prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    include: { category: true, _count: { select: { movements: true } } },
  });

  const reservedMap = await getReservedStockMap(products.map((p) => p.id));
  res.json({ success: true, data: products.map((p) => serialize(p, reservedMap.get(p.id) ?? 0)) });
});

export const getInventoryItem = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.productId },
    include: {
      category: true,
      _count: { select: { movements: true } },
      movements: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!product) throw ApiError.notFound("Product not found");

  const reservedMap = await getReservedStockMap([product.id]);
  res.json({
    success: true,
    data: { ...serialize(product, reservedMap.get(product.id) ?? 0), history: product.movements },
  });
});

export const adjustStock = asyncHandler(async (req: Request, res: Response) => {
  const { delta, note } = req.body as { delta: number; note?: string };

  const product = await prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({ where: { id: req.params.productId } });
    if (!existing) throw ApiError.notFound("Product not found");

    const nextStock = Math.max(0, existing.stock + delta);
    await tx.inventoryMovement.create({
      data: { productId: existing.id, type: "adjustment", quantity: nextStock - existing.stock, note },
    });

    return tx.product.update({ where: { id: existing.id }, data: { stock: nextStock } });
  });

  res.json({ success: true, data: { productId: product.id, availableStock: product.stock } });
});

export const bulkUpdateStock = asyncHandler(async (req: Request, res: Response) => {
  const items = req.body as { productId: string; availableStock: number }[];

  await prisma.$transaction(async (tx) => {
    for (const { productId, availableStock } of items) {
      const existing = await tx.product.findUnique({ where: { id: productId } });
      if (!existing) continue;
      await tx.inventoryMovement.create({
        data: {
          productId,
          type: "adjustment",
          quantity: availableStock - existing.stock,
          note: "Bulk stock update",
        },
      });
      await tx.product.update({ where: { id: productId }, data: { stock: availableStock } });
    }
  });

  res.json({ success: true, data: { updated: items.length } });
});
