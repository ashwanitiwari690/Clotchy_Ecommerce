import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { registerUser, validateCredentials, getUserProfile, userExistsByPhone, resetPassword } from "../services/auth.service";
import { requestOtp } from "../services/otp.service";
import { signAccessToken } from "../services/token.service";
import { ApiError } from "../utils/ApiError";
import { ACCESS_COOKIE_NAME, accessCookieOptions } from "../utils/cookies";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, password } = req.body;
  const user = await registerUser(name, phone, password);

  const accessToken = signAccessToken(user.id, user.role);
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
  res.status(201).json({ success: true, data: { user, accessToken } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  const user = await validateCredentials(phone, password);

  const accessToken = signAccessToken(user.id, user.role);
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, avatar: user.avatar },
      accessToken,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(ACCESS_COOKIE_NAME, accessCookieOptions);
  res.json({ success: true, data: null });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserProfile(req.user!.id);
  res.json({ success: true, data: user });
});

export const forgotPasswordSendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  const exists = await userExistsByPhone(phone);
  if (!exists) {
    throw ApiError.notFound("No account found with this mobile number");
  }
  await requestOtp(phone);
  res.json({ success: true, data: { message: "OTP sent" } });
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { phone, newPassword } = req.body;
  const user = await resetPassword(phone, newPassword);

  const accessToken = signAccessToken(user.id, user.role);
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
  res.json({ success: true, data: { user, accessToken } });
});
