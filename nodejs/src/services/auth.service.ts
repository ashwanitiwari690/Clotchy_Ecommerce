import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { consumeVerifiedOtp } from "./otp.service";

const SALT_ROUNDS = 12;

// Runs the existing-user check, OTP-verification check, and user creation in one
// transaction so a phone can't be registered without a verified OTP being consumed,
// even under concurrent requests.
export const registerUser = async (name: string, phone: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { phone } });
    if (existing) {
      throw ApiError.conflict("An account with this mobile number already exists");
    }

    await consumeVerifiedOtp(tx, phone);

    return tx.user.create({
      data: { name, phone, passwordHash },
      select: { id: true, name: true, phone: true, email: true, role: true, avatar: true, createdAt: true },
    });
  });
};

export const validateCredentials = async (phone: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw ApiError.unauthorized("Invalid mobile number or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid mobile number or password");
  }

  return user;
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, phone: true, email: true, role: true, avatar: true },
  });
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }
  return user;
};

export const userExistsByPhone = async (phone: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { phone }, select: { id: true } });
  return !!user;
};

// Same OTP-verification guard as registration, but against an existing account:
// only a phone with a verified-and-unconsumed OTP can have its password reset.
export const resetPassword = async (phone: string, newPassword: string) => {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { phone } });
    if (!existing) {
      throw ApiError.badRequest("No account found with this mobile number");
    }

    await consumeVerifiedOtp(tx, phone);

    return tx.user.update({
      where: { phone },
      data: { passwordHash },
      select: { id: true, name: true, phone: true, email: true, role: true, avatar: true },
    });
  });
};
