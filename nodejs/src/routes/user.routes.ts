import { Router } from "express";
import { updateMe, getMyAddress, saveMyAddress } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, addressSchema } from "../validators/user.validator";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.patch("/me", validate(updateProfileSchema), updateMe);
router.get("/me/address", getMyAddress);
router.put("/me/address", validate(addressSchema), saveMyAddress);

export default router;
