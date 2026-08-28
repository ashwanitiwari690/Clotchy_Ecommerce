import { Router } from "express";
import {
  listAttributes,
  getAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "../controllers/attribute.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAttributeSchema, updateAttributeSchema } from "../validators/attribute.validator";

const router = Router();

router.get("/", listAttributes);
router.get("/:id", getAttribute);

router.post("/", authenticate, authorize("ADMIN"), validate(createAttributeSchema), createAttribute);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateAttributeSchema), updateAttribute);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteAttribute);

export default router;
