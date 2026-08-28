import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { resolveCoupon } from "../services/coupon.service";

export const listCoupons = asyncHandler(async (req: Request, res: Response) => {
  const { status, search } = req.query as { status?: string; search?: string };

  const coupons = await prisma.coupon.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search ? { code: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: coupons });
});

export const getCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!coupon) throw ApiError.notFound("Coupon not found");
  res.json({ success: true, data: coupon });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.create({ data: req.body }).catch((err: unknown) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw ApiError.conflict("A coupon with this code already exists");
    }
    throw err;
  });
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body }).catch(() => null);
  if (!coupon) throw ApiError.notFound("Coupon not found");
  res.json({ success: true, data: coupon });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await prisma.coupon.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Coupon not found");
  });
  res.status(204).send();
});

// Storefront "Apply" button: resolves + prices a coupon against the cart's
// current subtotal without creating an order or touching usedCount - actual
// redemption/usage-increment only happens inside `createOrder`.
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, subtotal } = req.body as { code: string; subtotal: number };
  const { discount, freeShipping } = await resolveCoupon(prisma, code, subtotal);
  res.json({ success: true, data: { discount, freeShipping } });
});
