import { Router } from "express";
import { listCustomers, getCustomer, updateCustomerStatus } from "../controllers/customer.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateCustomerStatusSchema } from "../validators/customer.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", listCustomers);
router.get("/:id", getCustomer);
router.patch("/:id", validate(updateCustomerStatusSchema), updateCustomerStatus);

export default router;
