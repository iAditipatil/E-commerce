import jwt from"jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware =(req,res,next)=>{
    const authHeader=req.header("Authorization");
    console.log("Token Lenth:",authHeader.Length);
 //   console.log("Token Start:",authHeader?.substra)
 // console.log

 if(!authHeader){
    return res
    .status(401)
    .json({message:"Access denied. No token provided"});
 }

 const token =authHeader.startWith("Bearer")
 ? authHeader.split(" ")[1]
 :authHeader;

 try{
    const decoded =jwt.verify(token,process.env.JWT_SECRET);
    req.user =decoded;
    next();
 }  catch(error){
    res.status(400).json({ message:"Invalid token"});
 }
 console.log("Authorization header;",token);
}

export const adminMiddleware =(req, res ,next)=>{
    if(req.user.role !=="admin"){
        return res.status(403).json({ message:"Admin access required" });
     }
        next();
}
export default authMiddleware;
