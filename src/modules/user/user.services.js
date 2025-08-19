import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const userServices = {


    getProfile : async (req, res) => {
        try {
            req.user.phone = CryptoJS.AES.decrypt(req.user.phone, "saraha_123").toString(CryptoJS.enc.Utf8);


            return res.status(200).json({message:"Successfully retrieved user" , user : req.user});
        }catch (err) {

            return res.status(500).json({message:"Server Error" , massage:err.message , err});
        }
    }



};









export default userServices;