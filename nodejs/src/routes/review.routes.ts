import { Router } from "express";
import { listReviews, getReview, updateReviewStatus, deleteReview } from "../controllers/review.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateReviewStatusSchema } from "../validators/review.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", listReviews);
router.get("/:id", getReview);
router.patch("/:id", validate(updateReviewStatusSchema), updateReviewStatus);
router.delete("/:id", deleteReview);

export default router;
