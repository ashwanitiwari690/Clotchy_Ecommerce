import { Router } from "express";
import { faq, getFaq } from "../controllers/faq.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createFaqSchema, updateFaqSchema } from "../validators/faq.validator";

const router = Router();

router.get("/", faq.list);
router.get("/:id", getFaq);

router.post("/", authenticate, authorize("ADMIN"), validate(createFaqSchema), faq.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateFaqSchema), faq.update);
router.delete("/:id", authenticate, authorize("ADMIN"), faq.remove);
router.post("/:id/move", authenticate, authorize("ADMIN"), faq.move);

export default router;
