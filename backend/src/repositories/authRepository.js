import Admin from "../models/Admin.js";

const findAdminByEmail = async (email) => {
    return await Admin.findOne({ email }).select("+password");
};

const createAdmin = async (adminData) => {
    return await Admin.create(adminData);
};

const updateLastLogin = async (adminId) => {
    return await Admin.findByIdAndUpdate(
        adminId,
        {
            lastLogin: new Date(),
        },
        {
            new: true,
        }
    );
};

export {
    findAdminByEmail,
    createAdmin,
    updateLastLogin,
};