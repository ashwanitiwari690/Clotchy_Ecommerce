import { Router } from "express";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

const router = Router();

router.get("/", listCategories);
router.get("/:id", getCategory);

router.post("/", authenticate, authorize("ADMIN"), validate(createCategorySchema), createCategory);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateCategorySchema), updateCategory);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategory);

export default router;
