import express from "express"; 
import cors from "cors";

const app = express(); 

//Enable Cross-Origin Resoucre sharing
app.use(cors());

//Parse incoming JSON requests
app.use(express.json());

//Parse URL - encoded form data
app.use(express.urlencoded({extended:true}));


//Health Check Route
app.get("/",(req,res) =>{
    res.status(200).json({
        sucess:true,
        message:"RenewCred CMS API is running successfully"
    });
}); 

export default app;