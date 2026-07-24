import express from "express";
import { loginController } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginController);

router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated successfully",
        admin: req.admin,
    });
});

export default router;