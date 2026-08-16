import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";
import { isProd } from "../config/env";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error(err);
    }
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  logger.error(err);
  return res.status(500).json({
    success: false,
    message: isProd ? "Internal server error" : (err as Error)?.message,
  });
};
