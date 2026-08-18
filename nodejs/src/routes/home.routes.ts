import { Router } from "express";
import * as ctrl from "../controllers/home.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as v from "../validators/home.validator";

const router = Router();

router.get("/", ctrl.getHomeAggregate);

router.use(authenticate, authorize("ADMIN"));

router.get("/hero", ctrl.hero.list);
router.post("/hero", validate(v.createHeroSchema), ctrl.hero.create);
router.patch("/hero/:id", validate(v.updateHeroSchema), ctrl.hero.update);
router.delete("/hero/:id", ctrl.hero.remove);
router.post("/hero/:id/move", validate(v.moveHeroSchema), ctrl.hero.move);

router.get("/categories", ctrl.homeCategory.list);
router.post("/categories", validate(v.createHomeCategorySchema), ctrl.homeCategory.create);
router.patch("/categories/:id", validate(v.updateHomeCategorySchema), ctrl.homeCategory.update);
router.delete("/categories/:id", ctrl.homeCategory.remove);
router.post("/categories/:id/move", validate(v.moveHomeCategorySchema), ctrl.homeCategory.move);

router.get("/collections", ctrl.homeCollection.list);
router.post("/collections", validate(v.createHomeCollectionSchema), ctrl.homeCollection.create);
router.patch("/collections/:id", validate(v.updateHomeCollectionSchema), ctrl.homeCollection.update);
router.delete("/collections/:id", ctrl.homeCollection.remove);
router.post("/collections/:id/move", validate(v.moveHomeCollectionSchema), ctrl.homeCollection.move);

router.get("/best-sellers", ctrl.bestSeller.list);
router.post("/best-sellers", validate(v.createBestSellerSchema), ctrl.bestSeller.create);
router.patch("/best-sellers/:id", validate(v.updateBestSellerSchema), ctrl.bestSeller.update);
router.delete("/best-sellers/:id", ctrl.bestSeller.remove);
router.post("/best-sellers/:id/move", validate(v.moveBestSellerSchema), ctrl.bestSeller.move);

router.get("/community", ctrl.community.list);
router.post("/community", validate(v.createCommunityImageSchema), ctrl.community.create);
router.patch("/community/:id", validate(v.updateCommunityImageSchema), ctrl.community.update);
router.delete("/community/:id", ctrl.community.remove);
router.post("/community/:id/move", validate(v.moveCommunityImageSchema), ctrl.community.move);

export default router;
