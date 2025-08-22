import userModel, {userRoles} from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import authRouter from "./auth.controller.js";
import sendEmail from "../../services/sendEmails.js";


const authService = {

    signup: async (req, res) => {

        const {name, email, password, conformedPassword, age, phone, gender} = req.body;

        // check Email
        const userExist = await userModel.findOne({email});

        if (userExist) {
            throw new Error("User already exists", {cause: 409});
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

        const isSendEmail = await sendEmail({html: `<a href='${link}'>click to conform your email</a>`});

        if (!isSendEmail) {
            throw new Error("fail to send Email", {cause: 400})
        }


        // add the user to the DB
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            age,
            phone: encryptedPhone,
            gender
        });

        return res.status(201).json({message: "Successfully registered", user});
    },

    signin: async (req, res) => {


        const {email, password} = req.body;

        // check for the user email
        const user = await userModel.findOne({email});

        if (!user) {
            throw new Error("User not found", {cause: 401});
        }

        // compare password
        const matchedPassword = bcrypt.compareSync(password, user.password);

        if (!matchedPassword) {
            throw new Error("password not match", {cause: 400})
        }

        if (user.conformed === false) {
            throw new Error("user not conformed", {cause: 404});
        }

        // creat the tokens
        const accessToken = jwt.sign(
            {id: user._id, email, name: user.name, gender: user.gender},
            user.role === userRoles.user ? "saraha_accessToken_user" : "saraha_accessToken_admin",
            {expiresIn: "10h"}
        );
        const refreshToken = jwt.sign(
            {id: user._id, email, name: user.name, gender: user.gender},
            user.role === userRoles.user ? "saraha_refreshToken_user" : "saraha_refreshToken_admin",
            {expiresIn: "10d"}
        );


        return res.status(200).json({message: "Successfully", accessToken, refreshToken});

    },

    conformEmail: async (req, res) => {

        const {token} = req.params;

        if (!token) {
            throw new Error("token missing", {cause: 400});
        }

        const decodedToken = jwt.verify(token, "ConformationEmail");

        // check for user
        const user = await userModel.findOne({email: decodedToken.email, conformed: false});

        if (!user) {
            throw new Error("User not found or already confirmed", {cause: 401})
        }

        user.conformed = true;

        await user.save();

        return res.status(200).json({massage: "user conformed successfully"});
    }

}


export default authService;









