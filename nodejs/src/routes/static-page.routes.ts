import { Router } from "express";
import {
  listStaticPages,
  getStaticPage,
  getStaticPageBySlug,
  createStaticPage,
  updateStaticPage,
  removeStaticPage,
} from "../controllers/static-page.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createStaticPageSchema, updateStaticPageSchema } from "../validators/static-page.validator";

const router = Router();

router.get("/slug/:slug", getStaticPageBySlug);

router.use(authenticate, authorize("ADMIN"));
router.get("/", listStaticPages);
router.get("/:id", getStaticPage);
router.post("/", validate(createStaticPageSchema), createStaticPage);
router.patch("/:id", validate(updateStaticPageSchema), updateStaticPage);
router.delete("/:id", removeStaticPage);

export default router;
