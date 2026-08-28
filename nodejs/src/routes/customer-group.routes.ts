import { Router } from "express";
import {
  listCustomerGroups,
  getCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
  deleteCustomerGroup,
} from "../controllers/customer-group.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCustomerGroupSchema, updateCustomerGroupSchema } from "../validators/customer-group.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", listCustomerGroups);
router.get("/:id", getCustomerGroup);
router.post("/", validate(createCustomerGroupSchema), createCustomerGroup);
router.patch("/:id", validate(updateCustomerGroupSchema), updateCustomerGroup);
router.delete("/:id", deleteCustomerGroup);

export default router;
