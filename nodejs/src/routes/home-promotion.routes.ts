import { Router } from "express";
import {
  listHomePromotions,
  getHomePromotion,
  createHomePromotion,
  updateHomePromotion,
  deleteHomePromotion,
} from "../controllers/home-promotion.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createHomePromotionSchema, updateHomePromotionSchema } from "../validators/home-promotion.validator";

const router = Router();

router.get("/", listHomePromotions);
router.get("/:id", getHomePromotion);

router.post("/", authenticate, authorize("ADMIN"), validate(createHomePromotionSchema), createHomePromotion);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateHomePromotionSchema), updateHomePromotion);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteHomePromotion);

export default router;
