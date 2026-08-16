import { Router } from "express";
import { register, login, logout, me, forgotPasswordSendOtp, resetPasswordHandler } from "../controllers/auth.controller";
import { sendOtp, verifyOtpHandler } from "../controllers/otp.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema, forgotPasswordSendOtpSchema, resetPasswordSchema } from "../validators/auth.validator";
import { sendOtpSchema, verifyOtpSchema } from "../validators/otp.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { authLimiter, otpLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/send-otp", otpLimiter, validate(sendOtpSchema), sendOtp);
router.post("/verify-otp", otpLimiter, validate(verifyOtpSchema), verifyOtpHandler);

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

router.post("/forgot-password/send-otp", otpLimiter, validate(forgotPasswordSendOtpSchema), forgotPasswordSendOtp);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), resetPasswordHandler);

export default router;
