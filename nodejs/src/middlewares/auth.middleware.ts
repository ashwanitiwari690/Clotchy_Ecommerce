import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/token.service";
import { ApiError } from "../utils/ApiError";
import { ACCESS_COOKIE_NAME } from "../utils/cookies";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : req.cookies?.[ACCESS_COOKIE_NAME];

  if (!token) {
    return next(ApiError.unauthorized("Access token missing"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized("Access token is invalid or expired"));
  }
};

export const authorize = (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }
  if (roles.length > 0 && !roles.includes(req.user.role)) {
    return next(ApiError.forbidden("You do not have permission to perform this action"));
  }
  next();
};
