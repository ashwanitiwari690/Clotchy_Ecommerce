import { Router } from "express";
import { testimonial, getTestimonial } from "../controllers/testimonial.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTestimonialSchema, updateTestimonialSchema } from "../validators/testimonial.validator";

const router = Router();

router.get("/", testimonial.list);
router.get("/:id", getTestimonial);

router.post("/", authenticate, authorize("ADMIN"), validate(createTestimonialSchema), testimonial.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateTestimonialSchema), testimonial.update);
router.delete("/:id", authenticate, authorize("ADMIN"), testimonial.remove);
router.post("/:id/move", authenticate, authorize("ADMIN"), testimonial.move);

export default router;
