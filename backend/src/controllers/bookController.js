import {
    createBookService,
    getBooksService,
    getBookByIdService,
} from "../services/bookService.js";

const createBookController = async (req, res) => {
    try {
        const book = await createBookService(
            req.body,
            req.admin.adminId
        );

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getBooksController = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getBookByIdController = async (req, res) => {

    try {

        const { id } = req.params;

        const book = await getBookByIdService(id);

        return res.status(200).json({
            success: true,
            data: book,
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
        });

    }

};

export {
    createBookController,
    getBooksController,
    getBookByIdController,
};