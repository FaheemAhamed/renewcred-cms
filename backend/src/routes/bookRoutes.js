import express from "express";

import { createBookController, getBooksController, getBookByIdController } from "../controllers/bookController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = express.Router();

router.get("/", getBooksController);

router.get("/:id", getBookByIdController);

router.post(
    "/",
    authenticate,
    authorize("super-admin", "admin"),
    createBookController
);

export default router;