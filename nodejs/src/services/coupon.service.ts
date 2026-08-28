import { Coupon, Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

export interface ResolvedCoupon {
  coupon: Coupon;
  discount: number;
  freeShipping: boolean;
}

// Shared by `POST /coupons/validate` (storefront preview) and `createOrder`
// (checkout) so the two never compute a discount differently. Accepts a
// transaction client so checkout can resolve + apply + increment usage
// atomically with the rest of the order write.
export const resolveCoupon = async (
  tx: Prisma.TransactionClient,
  code: string,
  subtotal: number,
): Promise<ResolvedCoupon> => {
  const coupon = await tx.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon) throw ApiError.badRequest("Invalid coupon code");
  if (coupon.status !== "active") throw ApiError.badRequest("This coupon is not active");

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    throw ApiError.badRequest("This coupon has expired or is not yet active");
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw ApiError.badRequest("This coupon has reached its usage limit");
  }
  if (subtotal < Number(coupon.minOrder)) {
    throw ApiError.badRequest(`Minimum order value for this coupon is ₹${Number(coupon.minOrder)}`);
  }

  let discount = 0;
  let freeShipping = false;

  if (coupon.discountType === "percentage") {
    discount = (subtotal * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscount != null) discount = Math.min(discount, Number(coupon.maxDiscount));
  } else if (coupon.discountType === "fixed") {
    discount = Math.min(Number(coupon.discountValue), subtotal);
  } else {
    freeShipping = true;
  }

  return { coupon, discount: Math.round(discount * 100) / 100, freeShipping };
};
