import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);

export default router;
