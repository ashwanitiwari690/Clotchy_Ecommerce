import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { listProductReviews, createReview } from "../controllers/review.controller";
import { authenticate, authorize, optionalAuthenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import { createReviewSchema } from "../validators/review.validator";

const router = Router();

router.get("/", optionalAuthenticate, listProducts);
router.get("/:id", optionalAuthenticate, getProduct);
router.get("/:id/reviews", listProductReviews);
router.post("/:id/reviews", authenticate, validate(createReviewSchema), createReview);

router.post("/", authenticate, authorize("ADMIN"), validate(createProductSchema), createProduct);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProduct);

export default router;
