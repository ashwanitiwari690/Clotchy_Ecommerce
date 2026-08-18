import { Router } from "express";
import {
  listCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collection.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCollectionSchema, updateCollectionSchema } from "../validators/collection.validator";

const router = Router();

router.get("/", listCollections);
router.get("/:id", getCollection);

router.post("/", authenticate, authorize("ADMIN"), validate(createCollectionSchema), createCollection);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateCollectionSchema), updateCollection);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCollection);

export default router;
