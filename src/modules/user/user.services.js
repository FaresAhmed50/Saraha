import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const userServices = {

    getProfile : async (req, res) => {

            req.user.phone = CryptoJS.AES.decrypt(req.user.phone, process.env.PHONE_ENCRYPTION).toString(CryptoJS.enc.Utf8);

            return res.status(200).json({message:"Successfully retrieved user" , user : req.user})
    }

};









export default userServices;