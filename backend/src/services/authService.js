import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    findAdminByEmail,
    updateLastLogin,
} from "../repositories/authRepository.js";

import ApiError from "../utils/ApiError.js";

const login = async ({ email, password }) => {

    const admin = await findAdminByEmail(email);

    if (!admin) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        admin.password
    );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    if (!admin.isActive) {
        throw new ApiError(
            403,
            "Admin account is inactive"
        );
    }

    const token = jwt.sign(
        {
            adminId: admin._id,
            role: admin.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );

    await updateLastLogin(admin._id);

    return {
        token,
        admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
        },
    };
};

export { login };