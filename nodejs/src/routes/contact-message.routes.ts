import { Router } from "express";
import {
  listContactMessages,
  getContactMessage,
  createContactMessage,
  updateContactMessageStatus,
} from "../controllers/contact-message.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createContactMessageSchema, updateContactMessageSchema } from "../validators/contact-message.validator";

const router = Router();

router.post("/", validate(createContactMessageSchema), createContactMessage);

router.use(authenticate, authorize("ADMIN"));

router.get("/", listContactMessages);
router.get("/:id", getContactMessage);
router.patch("/:id", validate(updateContactMessageSchema), updateContactMessageStatus);

export default router;
