const errorMiddleware = (error, req, res, next) => {

    // Default Status Code & Message
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    /**
     * Invalid MongoDB ObjectId
     * Example:
     * GET /api/v1/books/abc
     */
    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    /**
     * Mongoose Validation Errors
     */
    if (error.name === "ValidationError") {
        statusCode = 400;

        message = Object.values(error.errors)
            .map(err => err.message)
            .join(", ");
    }

    /**
     * Duplicate Key Error
     * Example:
     * Duplicate ISBN
     */
    if (error.code === 11000) {
        statusCode = 409;

        const field = Object.keys(error.keyValue)[0];

        message = `${field} already exists`;
    }

    /**
     * Invalid JWT Token
     */
    if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    /**
     * Expired JWT Token
     */
    if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired";
    }

    /**
     * Final Response
     */
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;