import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/stats", getDashboardStats);

export default router;
