import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

interface OrderedRow {
  id: string;
  displayOrder: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface OrderedDelegate {
  findMany: (args?: any) => Promise<OrderedRow[]>;
  create: (args: { data: any }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: any }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Every home-page section (hero banners, featured categories/collections,
// best sellers, community images) is a small admin-curated, manually-ordered
// list with identical CRUD + reorder behavior - built once here instead of
// five near-identical copies of the same handlers.
const buildOrderedHandlers = (delegate: OrderedDelegate, notFoundMessage: string, conflictMessage: string) => {
  const list = asyncHandler(async (_req: Request, res: Response) => {
    const items = await delegate.findMany({ orderBy: { displayOrder: "asc" } });
    res.json({ success: true, data: items });
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const item = await delegate.create({ data: req.body }).catch((err: unknown) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw ApiError.conflict(conflictMessage);
      }
      throw err;
    });
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const item = await delegate.update({ where: { id: req.params.id }, data: req.body }).catch(() => null);
    if (!item) throw ApiError.notFound(notFoundMessage);
    res.json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    await delegate.delete({ where: { id: req.params.id } }).catch(() => {
      throw ApiError.notFound(notFoundMessage);
    });
    res.status(204).send();
  });

  const move = asyncHandler(async (req: Request, res: Response) => {
    const { direction } = req.body as { direction: "up" | "down" };
    const sorted = (await delegate.findMany({ orderBy: { displayOrder: "asc" } })).sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const idx = sorted.findIndex((x) => x.id === req.params.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;

    if (idx >= 0 && swapIdx >= 0 && swapIdx < sorted.length) {
      const a = sorted[idx];
      const b = sorted[swapIdx];
      await Promise.all([
        delegate.update({ where: { id: a.id }, data: { displayOrder: b.displayOrder } }),
        delegate.update({ where: { id: b.id }, data: { displayOrder: a.displayOrder } }),
      ]);
    }

    const items = await delegate.findMany({ orderBy: { displayOrder: "asc" } });
    res.json({ success: true, data: items });
  });

  return { list, create, update, remove, move };
};

export const hero = buildOrderedHandlers(prisma.heroBanner, "Hero banner not found", "Duplicate hero banner");
export const homeCategory = buildOrderedHandlers(
  prisma.homeCategoryFeature,
  "Home category feature not found",
  "This category is already featured on the homepage",
);
export const homeCollection = buildOrderedHandlers(
  prisma.homeCollectionFeature,
  "Home collection feature not found",
  "This collection is already featured on the homepage",
);
export const bestSeller = buildOrderedHandlers(
  prisma.bestSellerFeature,
  "Best seller feature not found",
  "This product is already a best seller",
);
export const community = buildOrderedHandlers(
  prisma.communityImage,
  "Community image not found",
  "Duplicate community image",
);

// Public aggregate powering the storefront home page - one request instead of
// five, with just the joined fields the page actually renders.
export const getHomeAggregate = asyncHandler(async (_req: Request, res: Response) => {
  const [heroes, categoryFeatures, collectionFeatures, bestSellerFeatures, community] = await Promise.all([
    prisma.heroBanner.findMany({ where: { status: "active" }, orderBy: { displayOrder: "asc" } }),
    prisma.homeCategoryFeature.findMany({
      where: { status: "active" },
      orderBy: { displayOrder: "asc" },
      include: { category: true },
    }),
    prisma.homeCollectionFeature.findMany({
      where: { status: "active" },
      orderBy: { displayOrder: "asc" },
      include: { collection: true },
    }),
    prisma.bestSellerFeature.findMany({
      where: { status: "active" },
      orderBy: { displayOrder: "asc" },
      include: { product: { include: { category: true, collections: true, variants: true } } },
    }),
    prisma.communityImage.findMany({ where: { status: "active" }, orderBy: { displayOrder: "asc" } }),
  ]);

  res.json({
    success: true,
    data: {
      hero: heroes[0] ?? null,
      categories: categoryFeatures.map((f) => ({
        id: f.category.id,
        name: f.category.name,
        slug: f.category.slug,
        image: f.category.image,
      })),
      collections: collectionFeatures.map((f) => ({
        id: f.collection.id,
        name: f.collection.name,
        slug: f.collection.slug,
        image: f.collection.image,
        description: f.collection.description,
        shortDescription: f.shortDescription,
        link: f.link,
      })),
      bestSellers: bestSellerFeatures.map((f) => f.product),
      community: community.map((c) => ({
        id: c.id,
        image: c.image,
        title: c.title,
        description: c.description,
        socialUrl: c.socialUrl,
      })),
    },
  });
});
