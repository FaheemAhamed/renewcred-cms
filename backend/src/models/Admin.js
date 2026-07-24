import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minlength: 3,
        maxlength: 30,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false,
    },

    role: {
        type: String,
        enum: ["super-admin", "admin", "editor"],
        default: "admin",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    lastLogin: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;