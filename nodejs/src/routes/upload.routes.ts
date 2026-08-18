import { Router } from "express";
import { uploadImage, uploadImages } from "../controllers/upload.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.post("/", upload.single("file"), uploadImage);
router.post("/multiple", upload.array("files", 10), uploadImages);

export default router;
