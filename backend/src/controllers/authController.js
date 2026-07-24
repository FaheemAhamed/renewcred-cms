import { login } from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";

const loginController = asyncHandler(async (req, res) => {

    const result = await login(req.body);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });

});

export { loginController };