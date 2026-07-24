import {
    createBookService,
    getBooksService,
    getBookByIdService,
    updateBookService,
    deleteBookService,
} from "../services/bookService.js";

import asyncHandler from "../utils/asyncHandler.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

const createBookController = asyncHandler(async (req, res) => {

    let imageResult = null;
    let pdfResult = null;

    try {

        /**
         * Upload Cover Image
         */
        if (req.files?.coverImage?.length) {

            imageResult = await uploadToCloudinary(
                req.files.coverImage[0].buffer,
                "books/images"
            );

        }

        /**
         * Upload PDF
         */
        if (req.files?.pdfFile?.length) {

            pdfResult = await uploadToCloudinary(
                req.files.pdfFile[0].buffer,
                "books/pdfs",
                "raw"
            );

        }

        const book = await createBookService(
            {
                ...req.body,

                coverImage: imageResult?.secure_url || "",
                coverImagePublicId: imageResult?.public_id || "",

                pdfUrl: pdfResult?.secure_url || "",
                pdfPublicId: pdfResult?.public_id || "",
            },
            req.admin.adminId
        );

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });

    } catch (error) {

        // Rollback uploaded image if anything fails
        if (imageResult?.public_id) {

            await deleteFromCloudinary(
                imageResult.public_id,
                "image"
            );

        }

        // Rollback uploaded PDF if anything fails
        if (pdfResult?.public_id) {

            await deleteFromCloudinary(
                pdfResult.public_id,
                "raw"
            );

        }

        throw error;

    }

});

const getBooksController = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "-createdAt";

    const result = await getBooksService({
        page,
        limit,
        search,
        category,
        status,
        sort,
    });

    return res.status(200).json({
        success: true,
        data: result.books,
        pagination: result.pagination,
    });

});

const getBookByIdController = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const book = await getBookByIdService(id);

    return res.status(200).json({
        success: true,
        data: book,
    });

});

const updateBookController = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const existingBook = await getBookByIdService(id);

    let imageResult = null;
    let pdfResult = null;

    try {

        let coverImage = existingBook.coverImage;
        let coverImagePublicId = existingBook.coverImagePublicId;

        let pdfUrl = existingBook.pdfUrl;
        let pdfPublicId = existingBook.pdfPublicId;

        /**
         * Upload New Cover Image
         */
        if (req.files?.coverImage?.length) {

            imageResult = await uploadToCloudinary(
                req.files.coverImage[0].buffer,
                "books/images"
            );

            coverImage = imageResult.secure_url;
            coverImagePublicId = imageResult.public_id;

        }

        /**
         * Upload New PDF
         */
        if (req.files?.pdfFile?.length) {

            pdfResult = await uploadToCloudinary(
                req.files.pdfFile[0].buffer,
                "books/pdfs",
                "raw"
            );

            pdfUrl = pdfResult.secure_url;
            pdfPublicId = pdfResult.public_id;

        }

        /**
         * Update MongoDB
         */
        const updatedBook = await updateBookService(
            id,
            {
                ...req.body,

                coverImage,
                coverImagePublicId,

                pdfUrl,
                pdfPublicId,
            }
        );

        /**
         * Delete old image after successful update
         */
        if (
            imageResult &&
            existingBook.coverImagePublicId
        ) {

            await deleteFromCloudinary(
                existingBook.coverImagePublicId,
                "image"
            );

        }

        /**
         * Delete old PDF after successful update
         */
        if (
            pdfResult &&
            existingBook.pdfPublicId
        ) {

            await deleteFromCloudinary(
                existingBook.pdfPublicId,
                "raw"
            );

        }

        return res.status(200).json({
            success: true,
            message: "Book updated successfully.",
            data: updatedBook,
        });

    } catch (error) {

        /**
         * Rollback newly uploaded image
         */
        if (imageResult?.public_id) {

            await deleteFromCloudinary(
                imageResult.public_id,
                "image"
            );

        }

        /**
         * Rollback newly uploaded PDF
         */
        if (pdfResult?.public_id) {

            await deleteFromCloudinary(
                pdfResult.public_id,
                "raw"
            );

        }

        throw error;

    }

});

const deleteBookController = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await deleteBookService(id);

    return res.status(200).json({
        success: true,
        message: "Book deleted successfully",
    });

});

export {
    createBookController,
    getBooksController,
    getBookByIdController,
    updateBookController,
    deleteBookController,
};