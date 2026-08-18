import { Router } from "express";
import {
  listInventory,
  getInventoryItem,
  adjustStock,
  bulkUpdateStock,
} from "../controllers/inventory.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { adjustStockSchema, bulkUpdateStockSchema } from "../validators/inventory.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", listInventory);
router.patch("/bulk", validate(bulkUpdateStockSchema), bulkUpdateStock);
router.get("/:productId", getInventoryItem);
router.post("/:productId/adjust", validate(adjustStockSchema), adjustStock);

export default router;
