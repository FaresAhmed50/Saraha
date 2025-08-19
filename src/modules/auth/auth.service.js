import userModel, {userRoles} from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import authRouter from "./auth.controller.js";
import sendEmail from "../../services/sendEmails.js";


const authService = {

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

        //send link to conform email
        const emailToken = jwt.sign(
            {email},
            "ConformationEmail",
            {expiresIn: "1h"}
        );
        const link = `http://localhost:3000/auth/conformEmail/${emailToken}`;

        const isSendEmail = await sendEmail({html : `<a href='${link}'>click to conform your email</a>`  });

        if(!isSendEmail){
            return res.status(400).json({message:"fail to send Email"});
        }


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

            // check for the user email
            const user = await userModel.findOne({email});
            if (!user) {
                return res.status(401).json({message:"User not found"});
            }

            // compare password
            const matchedPassword = bcrypt.compareSync(password, user.password);

            if (!matchedPassword) {
                return res.status(400).json({message:"password not match"});
            }

            if(user.conformed === false){
                return res.status(404).json({message:"user not conformed"});
            }

            // creat the tokens
            const accessToken = jwt.sign(
                {id: user._id, email, name: user.name, gender: user.gender},
                user.role === userRoles.user ? "saraha_accessToken_user" : "saraha_accessToken_admin",
                {expiresIn: "10h"}
            );
            const refreshToken = jwt.sign(
                {id : user._id , email , name : user.name , gender : user.gender},
                user.role === userRoles.user ? "saraha_refreshToken_user" : "saraha_refreshToken_admin",
                {expiresIn: "10d"}
            );


            return res.status(200).json({message:"Successfully" , accessToken , refreshToken });

        }catch(err){
            return res.status(500).json({message:"server  error" , massage:err.message , err});
        }
    },

    conformEmail : async (req, res) => {
        try {
            const {token} = req.params;

            if(!token){
                return res.status(400).json({message:"token missing"});
            }

            const decodedToken = jwt.verify(token, "ConformationEmail");

            // check for user
            const user = await userModel.findOne({email : decodedToken.email , conformed : false });

            if (!user) {
                return res.status(401).json({message:"User not found or already confirmed"});
            }


            user.conformed = true;

            await user.save();

            return res.status(200).json({massage: "user conformed successfully"});

        }catch (err){
            return res.status(500).json({massage : "server  error" , err : err , errMassage : err.massage});
        }
    }

}





export default authService;









