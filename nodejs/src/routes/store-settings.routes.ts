import { Router } from "express";
import { getStoreSettings, updateStoreSettings } from "../controllers/store-settings.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateStoreSettingsSchema } from "../validators/store-settings.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", getStoreSettings);
router.put("/", validate(updateStoreSettingsSchema), updateStoreSettings);

export default router;
