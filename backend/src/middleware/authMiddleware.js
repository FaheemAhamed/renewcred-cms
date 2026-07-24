import jwt from "jsonwebtoken";

const authenticate = (req,res,next) =>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"Access token is missing",
            });
        } 

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Invalid authorizantion header",
            });
        } 

        const decoded = jwt.verify(token,process.env.JWT_SECRET); 

        req.admin = decoded;

        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token",
        })
    }
}; 

export {authenticate};