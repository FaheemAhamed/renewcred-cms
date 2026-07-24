import express from "express";
import { uploadMediaController } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Protected Route for Admin Media Uploads
 */
router.post(
  "/",
  authenticate,
  authorize("super-admin", "admin"),
  upload.single("file"),
  uploadMediaController
);

export default router;
