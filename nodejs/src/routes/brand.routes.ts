import { Router } from "express";
import { listBrands, getBrand, createBrand, updateBrand, deleteBrand } from "../controllers/brand.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createBrandSchema, updateBrandSchema } from "../validators/brand.validator";

const router = Router();

router.get("/", listBrands);
router.get("/:id", getBrand);

router.post("/", authenticate, authorize("ADMIN"), validate(createBrandSchema), createBrand);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateBrandSchema), updateBrand);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteBrand);

export default router;
