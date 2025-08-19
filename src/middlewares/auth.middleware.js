import CryptoJS from "crypto-js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";



export const authMiddleware = async  (req, res, next) => {
    try {

        console.log(req.headers);
        const authorization = req.headers["authorization"];


        if (!authorization) {
            return res.status(404).json({message:"No token provided"});
        }

        const [prefix , token] = authorization.split(" ");

        if (!token || !prefix) {
            return res.status(404).json({message:"invalid token provided or invalid prefix"});
        }

        let signature = "";

        switch (prefix) {
            case "Bearer":
                signature = "saraha_accessToken_user";
                break;
            case "Admin":
                signature = "saraha_accessToken_admin";
                break;
            default:
                return res.status(400).json({message: "invalid prefix"});
        }

        // decode access token
        const decodedToken = jwt.verify(token, signature);

        // check for user
        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({message:"User not found"});
        }

        req.user = user;

        return next();
    }catch (err){
        return res.status(500).json({message:"server error" , errorMassage:err.message , err });
    }
}


















