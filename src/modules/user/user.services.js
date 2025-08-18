import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";


const userServices = {

    signup: async (req, res) => {

        const {name , email , password , conformedPassword , age , phone , gender} = req.body;

        // check Password
        if(password !== conformedPassword){
            return res.status(400).json({message:"Password must match"});
        }

        // check Email
        const userExist = await userModel.findOne({email});

        if (userExist) {
            return res.status(409).json({message:"User already exists"});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //phone encryption
        const encryptedPhone = CryptoJS.AES.encrypt(phone, "saraha_123").toString();


        // add the user to the DB
        const user = await userModel.create({
            name,
            email,
            password : hashedPassword,
            age,
            phone : encryptedPhone,
            gender
        });

        return res.status(201).json({message:"Successfully registered" , user});
    }



};









export default userServices;