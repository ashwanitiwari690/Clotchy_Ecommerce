import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { sendOtpSms } from "./sms.service";

const hashOtp = (otp: string) => crypto.createHash("sha256").update(otp).digest("hex");

const generateOtp = (): string => {
  const max = 10 ** env.OTP_LENGTH;
  return crypto.randomInt(0, max).toString().padStart(env.OTP_LENGTH, "0");
};

export const requestOtp = async (phone: string): Promise<void> => {
  const cooldownStart = new Date(Date.now() - env.OTP_RESEND_COOLDOWN_SECONDS * 1000);
  const recent = await prisma.otpVerification.findFirst({
    where: { phone, createdAt: { gt: cooldownStart } },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    throw ApiError.badRequest("Please wait before requesting another OTP");
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpVerification.create({ data: { phone, otpHash, expiresAt } });
  await sendOtpSms(phone, otp);
};

export const verifyOtp = async (phone: string, otp: string): Promise<void> => {
  const record = await prisma.otpVerification.findFirst({
    where: { phone, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw ApiError.badRequest("No OTP request found for this number. Please request a new OTP.");
  }
  if (record.expiresAt < new Date()) {
    throw ApiError.badRequest("OTP has expired. Please request a new one.");
  }
  if (record.attempts >= env.OTP_MAX_ATTEMPTS) {
    throw ApiError.badRequest("Too many incorrect attempts. Please request a new OTP.");
  }

  if (record.otpHash !== hashOtp(otp)) {
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw ApiError.badRequest("Incorrect OTP");
  }

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date() },
  });
};

// Shared by registration and password reset: consumes the most recent
// verified-but-unused OTP for this phone so it can't be replayed for a second action.
export const consumeVerifiedOtp = async (tx: Prisma.TransactionClient, phone: string): Promise<void> => {
  const validSince = new Date(Date.now() - env.OTP_VERIFICATION_VALIDITY_MINUTES * 60 * 1000);
  const record = await tx.otpVerification.findFirst({
    where: { phone, consumedAt: null, verifiedAt: { not: null, gt: validSince } },
    orderBy: { verifiedAt: "desc" },
  });

  if (!record) {
    throw ApiError.badRequest("Please verify your mobile number with OTP first.");
  }

  await tx.otpVerification.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
};
