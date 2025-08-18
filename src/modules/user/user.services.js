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
    },

    signin : async (req, res) => {

        try {
            const {email , password} = req.body;

            const user = await userModel.findOne({email});
            if (!user) {
                return res.status(401).json({message:"User not found"});
            }

            const matchedPassword = bcrypt.compareSync(password, user.password);

            if (!matchedPassword) {
                return res.status(400).json({message:"password not match"});
            }

            return res.status(200).json({message:"Successfully" , user});

        }catch(err){
            return res.status(500).json({message:"server  error" , massage:err.message , err});
        }



    }



};









export default userServices;