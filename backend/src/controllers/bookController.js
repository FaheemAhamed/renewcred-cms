import {
    createBookService,
    getBooksService,
    getBookByIdService,
    updateBookService,
} from "../services/bookService.js";

import asyncHandler from "../utils/asyncHandler.js";

const createBookController = asyncHandler(async (req, res) => {

    const book = await createBookService(
        req.body,
        req.admin.adminId
    );

    return res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
    });

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

const updateBookController = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const updatedBook =
            await updateBookService(
                id,
                req.body
            );

        return res.status(200).json({

            success: true,

            message: "Book updated successfully",

            data: updatedBook,

        });

    }
);

export {
    createBookController,
    getBooksController,
    getBookByIdController,
    updateBookController,
};