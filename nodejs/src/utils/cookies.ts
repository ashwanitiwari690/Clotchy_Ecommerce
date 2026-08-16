import { CookieOptions } from "express";
import { env, isProd } from "../config/env";

export const ACCESS_COOKIE_NAME = "accessToken";

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  path: "/",
  maxAge: env.ACCESS_TOKEN_EXPIRY_MS,
};
