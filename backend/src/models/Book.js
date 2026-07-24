import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        subtitle: {
            type: String,
            trim: true,
            default: "",
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        publisher: {
            type: String,
            required: true,
            trim: true,
        },

        isbn: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        language: {
            type: String,
            default: "English",
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        coverImage: {
            type: String,
            default: "",
        },

        coverImagePublicId: {
            type: String,
            default: "",
        },

        pdfUrl: {
            type: String,
            default: "",
        },

        pdfPublicId: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Book", bookSchema);