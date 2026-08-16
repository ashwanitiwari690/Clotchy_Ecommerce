import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // Comma-separated list, e.g. "http://localhost:4200,http://localhost:4300"
  // (storefront + admin panel run as separate Angular apps on separate ports).
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  // No refresh token: the access token itself is the persistent session,
  // held in an httpOnly cookie until it expires or the user logs out.
  ACCESS_TOKEN_SECRET: z.string().min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_EXPIRY: z.string().default("30d"),
  ACCESS_TOKEN_EXPIRY_MS: z.coerce.number().default(30 * 24 * 60 * 60 * 1000),

  // Optional: OTP sending fails with a clear error until these are set, but the
  // server still boots without them so the rest of the API keeps working.
  FAST2SMS_API_KEY: z.string().optional(),
  FAST2SMS_OTP_TEMPLATE_ID: z.string().optional(),

  OTP_LENGTH: z.coerce.number().default(4),
  OTP_EXPIRY_MINUTES: z.coerce.number().default(5),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),
  OTP_VERIFICATION_VALIDITY_MINUTES: z.coerce.number().default(15),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
