import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, authorize, optionalAuthenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";

const router = Router();

router.get("/", optionalAuthenticate, listProducts);
router.get("/:id", optionalAuthenticate, getProduct);

router.post("/", authenticate, authorize("ADMIN"), validate(createProductSchema), createProduct);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProduct);

export default router;
