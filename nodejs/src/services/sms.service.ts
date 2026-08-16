import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

interface Fast2SmsResponse {
  return: boolean;
  request_id?: string;
  message?: string[];
}

// Fast2SMS "Quick SMS" route (route=q) - no DLT template/otp_id required, so this
// works immediately for testing. NOTE: on an unverified/trial Fast2SMS account this
// route typically only delivers to numbers added as "verified" in the dashboard.
// Once you have a real OTP template ID from Fast2SMS, switch this to POST
// https://www.fast2sms.com/dev/otp/send with { mobile, otp_id, otp } instead -
// otp.service.ts doesn't need to change either way, since we generate/hash/verify
// the OTP ourselves regardless of which route delivers it.
export const sendOtpSms = async (phone: string, otp: string): Promise<void> => {
  if (!env.FAST2SMS_API_KEY) {
    logger.error("Fast2SMS is not configured (FAST2SMS_API_KEY missing)");
    throw new ApiError(500, "SMS provider is not configured", false);
  }

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: env.FAST2SMS_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message: `Your Clotchcy verification code is ${otp}. Valid for ${env.OTP_EXPIRY_MINUTES} minutes. Do not share this code.`,
      language: "english",
      flash: 0,
      numbers: phone,
    }),
  });

  const data = (await response.json()) as Fast2SmsResponse;

  if (!response.ok || !data.return) {
    logger.error({ data }, "Fast2SMS failed to send OTP");
    throw new ApiError(502, "Failed to send OTP SMS. Please try again shortly.");
  }
};
