import express from "express";

import {
    createBookController,
    getBooksController,
    getBookByIdController,
    updateBookController,
    deleteBookController,
} from "../controllers/bookController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Public Routes
 */
router.get("/", getBooksController);

router.get("/:id", getBookByIdController);

/**
 * Protected Routes
 */

// Create Book
router.post(
    "/",
    authenticate,
    authorize("super-admin", "admin"),
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
        {
            name: "pdfFile",
            maxCount: 1,
        },
    ]),
    createBookController
);

// Update Book
router.put(
    "/:id",
    authenticate,
    authorize("super-admin", "admin"),
    updateBookController
);

// Delete Book
router.delete(
    "/:id",
    authenticate,
    authorize("super-admin", "admin"),
    deleteBookController
);

export default router;