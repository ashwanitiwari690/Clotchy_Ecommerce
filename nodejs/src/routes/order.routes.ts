import { Router } from "express";
import { createOrder, listOrders, getOrder, trackOrder, updateOrderStatus } from "../controllers/order.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { checkoutSchema, updateOrderStatusSchema } from "../validators/order.validator";

const router = Router();

router.get("/track", trackOrder);

router.use(authenticate);

router.post("/", validate(checkoutSchema), createOrder);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", authorize("ADMIN"), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
