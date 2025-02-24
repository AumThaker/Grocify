import jwt from "jsonwebtoken"
import User from "../models/usermodel.js"
const verifyToken = async (req,res,next) =>{
    console.log(req.cookies)
    const loginToken = req.cookies?.loginToken
    if(!loginToken) return res.status(401).json({loginstatus:false,message:"Unauthorized request"})
    let decodedToken = await jwt.verify(loginToken,process.env.SECRET_KEY)
    let user = await User.findById(decodedToken._id)
    if(!user) res.status(401).json({loginstatus:false,message:"User not found"})
    req.user = user;
    next();
}
export default verifyToken