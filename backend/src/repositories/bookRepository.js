import Book from "../models/Book.js";

const createBook = async (bookData) => {
    return await Book.create(bookData);
};

const getBooks = async (
    query,
    skip,
    limit,
    sort
) => {

    return await Book.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

};

const countBooks = async (query) => {
    return await Book.countDocuments(query);
};

const getBookById = async (bookId) => {
    return await Book.findById(bookId);
};

const updateBook = async (bookId, updateData) => {

    return await Book.findByIdAndUpdate(
        bookId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

};

export {
    createBook,
    getBooks,
    countBooks,
    getBookById,
    updateBook,
};