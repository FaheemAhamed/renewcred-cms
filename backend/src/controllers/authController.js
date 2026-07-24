import {login} from "../services/authService.js";

const loginController = async (req,res) => {
    try{
        const result = await login(req.body);

        return res.status(200).json({
            success:true,
            message:"Login successful",
            data:result,
        });
    }catch(error){
        return res.status(401).json({
            success:false,
            message:error.message,
        });
    }
}; 

export {loginController};