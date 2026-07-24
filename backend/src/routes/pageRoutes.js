import express from "express";
import {
  createPageController,
  getPagesController,
  getPageBySlugController,
  getPageByIdController,
  updatePageController,
  deletePageController,
} from "../controllers/pageController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createPageSchema, updatePageSchema } from "../validators/pageValidator.js";

const router = express.Router();

/**
 * Public Routes
 */
router.get("/", getPagesController);
router.get("/slug/:slug", getPageBySlugController);

/**
 * Protected Admin Routes
 */
router.get("/:id", authenticate, getPageByIdController);

router.post(
  "/",
  authenticate,
  authorize("super-admin", "admin"),
  validate(createPageSchema),
  createPageController
);

router.put(
  "/:id",
  authenticate,
  authorize("super-admin", "admin"),
  validate(updatePageSchema),
  updatePageController
);

router.delete(
  "/:id",
  authenticate,
  authorize("super-admin", "admin"),
  deletePageController
);

export default router;
