import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const toReviewDto = (review: Prisma.ReviewGetPayload<{ include: { user: true; product: true } }>) => ({
  id: review.id,
  productId: review.productId,
  productName: review.product.name,
  customerId: review.userId,
  customerName: review.user.name,
  rating: review.rating,
  comment: review.comment,
  date: review.createdAt,
  status: review.status,
});

// Approved-only rating/reviewCount are the aggregate the storefront's product
// cards/detail page read - recomputed whenever a review's status changes so
// they never drift from what's actually visible to shoppers.
const recomputeProductRating = async (tx: Prisma.TransactionClient, productId: string) => {
  const agg = await tx.review.aggregate({
    where: { productId, status: "approved" },
    _avg: { rating: true },
    _count: true,
  });
  await tx.product.update({
    where: { id: productId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count,
    },
  });
};

export const listProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!product) throw ApiError.notFound("Product not found");

  const reviews = await prisma.review.findMany({
    where: { productId: req.params.id, status: "approved" },
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  const agg = await prisma.review.aggregate({
    where: { productId: req.params.id, status: "approved" },
    _avg: { rating: true },
    _count: true,
  });

  res.json({
    success: true,
    data: {
      reviews: reviews.map(toReviewDto),
      average: agg._avg.rating ?? 0,
      count: agg._count,
    },
  });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!product) throw ApiError.notFound("Product not found");

  const review = await prisma.review
    .create({
      data: {
        productId: req.params.id,
        userId: req.user!.id,
        rating: req.body.rating,
        comment: req.body.comment,
      },
      include: { user: true, product: true },
    })
    .catch((err: unknown) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw ApiError.conflict("You have already reviewed this product");
      }
      throw err;
    });

  res.status(201).json({ success: true, data: toReviewDto(review) });
});

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const { status, productId, search, page: pageQ, pageSize: pageSizeQ } = req.query as Record<
    string,
    string | undefined
  >;
  const page = Math.max(1, Number(pageQ) || 1);
  const pageSize = Math.min(50, Number(pageSizeQ) || 20);

  const where: Prisma.ReviewWhereInput = {
    ...(status ? { status } : {}),
    ...(productId ? { productId } : {}),
    ...(search
      ? {
          OR: [
            { comment: { contains: search, mode: "insensitive" } },
            { product: { name: { contains: search, mode: "insensitive" } } },
            { user: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      include: { user: true, product: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where }),
  ]);

  res.json({ success: true, data: reviews.map(toReviewDto), meta: { page, pageSize, total } });
});

export const getReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
    include: { user: true, product: true },
  });
  if (!review) throw ApiError.notFound("Review not found");
  res.json({ success: true, data: toReviewDto(review) });
});

export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: string };

  const review = await prisma.$transaction(async (tx) => {
    const updated = await tx.review
      .update({ where: { id: req.params.id }, data: { status }, include: { user: true, product: true } })
      .catch(() => null);
    if (!updated) return null;
    await recomputeProductRating(tx, updated.productId);
    return updated;
  });

  if (!review) throw ApiError.notFound("Review not found");
  res.json({ success: true, data: toReviewDto(review) });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) throw ApiError.notFound("Review not found");

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: req.params.id } });
    await recomputeProductRating(tx, review.productId);
  });

  res.status(204).send();
});
