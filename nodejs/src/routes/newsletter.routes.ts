import { Router } from "express";
import { getNewsletterConfig, updateNewsletterConfig } from "../controllers/newsletter.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateNewsletterConfigSchema } from "../validators/newsletter.validator";

const router = Router();

router.get("/", getNewsletterConfig);
router.put("/", authenticate, authorize("ADMIN"), validate(updateNewsletterConfigSchema), updateNewsletterConfig);

export default router;
