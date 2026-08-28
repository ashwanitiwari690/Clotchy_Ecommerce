import { Router } from "express";
import {
  listMarketingBanners,
  getMarketingBanner,
  createMarketingBanner,
  updateMarketingBanner,
  deleteMarketingBanner,
} from "../controllers/marketing-banner.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createMarketingBannerSchema, updateMarketingBannerSchema } from "../validators/marketing-banner.validator";

const router = Router();

router.get("/", listMarketingBanners);
router.get("/:id", getMarketingBanner);

router.post("/", authenticate, authorize("ADMIN"), validate(createMarketingBannerSchema), createMarketingBanner);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateMarketingBannerSchema), updateMarketingBanner);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteMarketingBanner);

export default router;
