import {
    createBook,
    getBooks,
    countBooks,
    getBookById,
} from "../repositories/bookRepository.js";

const createBookService = async (bookData, adminId) => {

    const newBook = await createBook({
        ...bookData,
        createdBy: adminId,
    });

    return newBook;
};

const getBooksService = async ({
    page,
    limit,
    search,
    category,
    status,
    sort,
}) => {

    // Dynamic Query Object
    const query = {};

    // Search by Title OR Author
    if (search) {
        query.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                author: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    // Filter by Category
    if (category) {
        query.category = category;
    }

    // Filter by Status
    if (status) {
        query.status = status;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch Books
    const books = await getBooks(
        query,
        skip,
        limit,
        sort
    );

    // Count Matching Books
    const total = await countBooks(query);

    const totalPages = Math.ceil(total / limit);

    return {
        books,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
}; 

const getBookByIdService = async (bookId) => {

    const book = await getBookById(bookId);

    if (!book) {
        throw new Error("Book not found");
    }

    return book;
};

export {
    createBookService,
    getBooksService,
    getBookByIdService,
};