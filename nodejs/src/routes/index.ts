import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import collectionRoutes from "./collection.routes";
import inventoryRoutes from "./inventory.routes";
import uploadRoutes from "./upload.routes";
import orderRoutes from "./order.routes";
import customerRoutes from "./customer.routes";
import homeRoutes from "./home.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/uploads", uploadRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/home", homeRoutes);

export default router;
