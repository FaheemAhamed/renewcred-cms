import express from "express"; 
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express(); 

//Enable Cross-Origin Resoucre sharing
app.use(cors());

//Parse incoming JSON requests
app.use(express.json());

//Parse URL - encoded form data
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/books", bookRoutes);

//Health Check Route
app.get("/",(req,res) =>{
    res.status(200).json({
        sucess:true,
        message:"RenewCred CMS API is running successfully"
    });
}); 

export default app;