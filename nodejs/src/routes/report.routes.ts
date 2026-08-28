import { Router } from "express";
import {
  getSalesReport,
  getOrdersReport,
  getProductsReport,
  getCustomersReport,
  getInventoryReport,
} from "../controllers/report.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/sales", getSalesReport);
router.get("/orders", getOrdersReport);
router.get("/products", getProductsReport);
router.get("/customers", getCustomersReport);
router.get("/inventory", getInventoryReport);

export default router;
