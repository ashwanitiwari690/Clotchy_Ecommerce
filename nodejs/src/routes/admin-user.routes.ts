import { Router } from "express";
import { listAdminUsers, getAdminUser, createAdminUser, updateAdminUser } from "../controllers/admin-user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAdminUserSchema, updateAdminUserSchema } from "../validators/admin-user.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", listAdminUsers);
router.get("/:id", getAdminUser);
router.post("/", validate(createAdminUserSchema), createAdminUser);
router.patch("/:id", validate(updateAdminUserSchema), updateAdminUser);

export default router;
