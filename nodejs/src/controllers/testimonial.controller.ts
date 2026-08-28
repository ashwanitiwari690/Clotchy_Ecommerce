import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { buildOrderedHandlers } from "./home.controller";

export const testimonial = buildOrderedHandlers(prisma.testimonial, "Testimonial not found", "Duplicate testimonial");

export const getTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
  if (!testimonial) throw ApiError.notFound("Testimonial not found");
  res.json({ success: true, data: testimonial });
});
