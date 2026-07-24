import express from "express";
import { loginController } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = express.Router();

router.post("/login", loginController);

router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated successfully",
        admin: req.admin,
    });
});

router.get(
    "/super-admin",
    authenticate,
    authorize("super-admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Super Admin"
        });
    }
);

router.get(
    "/admin",
    authenticate,
    authorize("super-admin", "admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

export default router;