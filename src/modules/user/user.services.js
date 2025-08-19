import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const userServices = {


    getProfile : async (req, res) => {

        try {
            const {authorization} = req.headers;

            // decode access token
            const decodedToken = jwt.verify(authorization, "saraha_accessToken" );

            // check for user
            const user = await userModel.findById(decodedToken.id);
            if (!user) {
                return res.status(401).json({message:"User not found"});
            }

            user.phone = CryptoJS.AES.decrypt(user.phone, "saraha_123").toString(CryptoJS.enc.Utf8);

            return res.status(200).json({message:"Successfully retrieved user" , user});

        }catch (err) {

            return res.status(500).json({message:"Server Error" , massage:err.message , err});
        }
    }



};









export default userServices;