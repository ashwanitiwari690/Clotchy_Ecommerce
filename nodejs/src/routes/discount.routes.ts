import { Router } from "express";
import {
  listDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../controllers/discount.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createDiscountSchema, updateDiscountSchema } from "../validators/discount.validator";

const router = Router();

router.get("/", listDiscounts);
router.get("/:id", getDiscount);

router.post("/", authenticate, authorize("ADMIN"), validate(createDiscountSchema), createDiscount);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateDiscountSchema), updateDiscount);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteDiscount);

export default router;
