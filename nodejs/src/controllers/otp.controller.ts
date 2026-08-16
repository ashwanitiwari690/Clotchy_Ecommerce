import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requestOtp, verifyOtp } from "../services/otp.service";

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  await requestOtp(phone);
  res.json({ success: true, data: { message: "OTP sent" } });
});

export const verifyOtpHandler = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  await verifyOtp(phone, otp);
  res.json({ success: true, data: { verified: true } });
});
