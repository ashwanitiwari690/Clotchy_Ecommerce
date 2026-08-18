import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const toUrl = (req: Request, filename: string) => `${req.protocol}://${req.get("host")}/uploads/${filename}`;

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  res.status(201).json({ success: true, data: { url: toUrl(req, req.file.filename), name: req.file.originalname } });
});

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  if (files.length === 0) throw ApiError.badRequest("No files uploaded");
  res.status(201).json({
    success: true,
    data: files.map((file) => ({ url: toUrl(req, file.filename), name: file.originalname })),
  });
});
