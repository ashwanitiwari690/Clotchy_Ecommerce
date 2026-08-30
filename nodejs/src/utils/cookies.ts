import { CookieOptions } from "express";
import { env } from "../config/env";

export const ACCESS_COOKIE_NAME = "accessToken";

// The dashboard (faxdev.fastadvert.services) and this API
// (clotchyecommerce-production.up.railway.app) live on different registrable
// domains, so every request between them is cross-site. Browsers only ever
// attach a cookie to a cross-site request when it's SameSite=None, and
// SameSite=None is only honored alongside Secure - hence both are hardcoded
// on rather than gated by isProd.
export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: env.ACCESS_TOKEN_EXPIRY_MS,
};
