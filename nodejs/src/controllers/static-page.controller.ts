import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listStaticPages = asyncHandler(async (_req: Request, res: Response) => {
  const pages = await prisma.staticPage.findMany({ orderBy: { title: "asc" } });
  res.json({ success: true, data: pages });
});

export const getStaticPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await prisma.staticPage.findUnique({ where: { id: req.params.id } });
  if (!page) throw ApiError.notFound("Page not found");
  res.json({ success: true, data: page });
});

// Public: only ever serves published content, keyed by the slug the storefront
// routes to (e.g. /shipping-policy) rather than an opaque id.
export const getStaticPageBySlug = asyncHandler(async (req: Request, res: Response) => {
  const page = await prisma.staticPage.findUnique({ where: { slug: req.params.slug } });
  if (!page || page.status !== "active") throw ApiError.notFound("Page not found");
  res.json({ success: true, data: page });
});

export const createStaticPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await prisma.staticPage.create({ data: req.body }).catch((err: unknown) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw ApiError.conflict("A page with this slug already exists");
    }
    throw err;
  });
  res.status(201).json({ success: true, data: page });
});

export const updateStaticPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await prisma.staticPage.update({ where: { id: req.params.id }, data: req.body }).catch((err: unknown) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw ApiError.conflict("A page with this slug already exists");
    }
    throw ApiError.notFound("Page not found");
  });
  res.json({ success: true, data: page });
});

export const removeStaticPage = asyncHandler(async (req: Request, res: Response) => {
  await prisma.staticPage.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Page not found");
  });
  res.status(204).send();
});
