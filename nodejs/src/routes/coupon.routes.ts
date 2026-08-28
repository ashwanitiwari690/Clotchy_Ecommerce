import { Router } from "express";
import {
  listCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/coupon.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from "../validators/coupon.validator";

const router = Router();

router.post("/validate", authenticate, validate(validateCouponSchema), validateCoupon);

router.use(authenticate, authorize("ADMIN"));

router.get("/", listCoupons);
router.get("/:id", getCoupon);
router.post("/", validate(createCouponSchema), createCoupon);
router.patch("/:id", validate(updateCouponSchema), updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
