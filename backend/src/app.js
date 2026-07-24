import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/pages", pageRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RenewCred CMS API is running successfully",
    });
});


app.use(errorMiddleware);

export default app;