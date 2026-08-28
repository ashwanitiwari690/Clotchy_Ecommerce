import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const SALT_ROUNDS = 12;

const safeSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  avatar: true,
  status: true,
  createdAt: true,
} as const;

export const listAdminUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query as { search?: string };

  const users = await prisma.user.findMany({
    where: {
      role: "ADMIN",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: safeSelect,
  });

  res.json({ success: true, data: users });
});

export const getAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, role: "ADMIN" },
    select: safeSelect,
  });
  if (!user) throw ApiError.notFound("Admin user not found");
  res.json({ success: true, data: user });
});

export const createAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user
    .create({
      data: { name, phone, email, passwordHash, role: "ADMIN" },
      select: safeSelect,
    })
    .catch((err: unknown) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw ApiError.conflict("An account with this phone or email already exists");
      }
      throw err;
    });

  res.status(201).json({ success: true, data: user });
});

export const updateAdminUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id === req.user!.id && req.body.status === "inactive") {
    throw ApiError.badRequest("You cannot deactivate your own account");
  }

  const user = await prisma.user
    .update({ where: { id: req.params.id }, data: req.body, select: safeSelect })
    .catch(() => null);
  if (!user) throw ApiError.notFound("Admin user not found");
  res.json({ success: true, data: user });
});
