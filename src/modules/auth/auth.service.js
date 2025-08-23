import userModel, {userRoles} from "../../models/user.model.js";
import {
    compareHash,
    eventEmitter,
    generateEncryption,
    generateHash,
    generateToken,
    verifyToken
} from "../../utilts/utilits.js"
import {customAlphabet, nanoid} from "nanoid";
import revokeModel from "../../models/revoke.model.js";
import cloudinary from "../../utilts/cloudnary/cloudnary.utilits.js";


const authService = {

        signup: async (req, res) => {

        const {name, email, password, age, phone, gender} = req.body;
        const image = req.file;

        if(!image){
            throw new Error("No image provided" , {cause : 400});
        }

        const data = await cloudinary.uploader.upload(req?.file?.path , {
            folder : "test"
        });


        // check Email
        const userExist = await userModel.findOne({email});

        if (userExist) {
            throw new Error("User already exists", {cause: 409});
        }

        //hash password
        const hashedPassword = await generateHash({
            plainText : password,
            signature : Number(process.env.SALTROUNDS)
        })

        //phone encryption
        const encryptedPhone = await generateEncryption({
            planeText: phone,
            signature : process.env.PHONE_ENCRYPTION
        });

        //send link to conform email
        eventEmitter.emit("sendEmail", {email});


        // add the user to the DB
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            age,
            phone: encryptedPhone,
            gender,
            image : data?.secure_url
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
        const matchedPassword = compareHash({
            plainText : password,
            cipherText : user.password
        });

        if (!matchedPassword) {
            throw new Error("password not match", {cause: 400})
        }

        if (user.conformed === false) {
            throw new Error("user not conformed", {cause: 404});
        }

        // creat the tokens
        const accessToken = await generateToken({
            payload : {id: user._id, email, name: user.name, gender: user.gender},
            signature : user.role === userRoles.user ? process.env.USER_ACCESS_TOKEN : process.env.ADMIN_ACCESS_TOKEN,
            options : {expiresIn: "1h" , jwtid : nanoid()}
        });
        const refreshToken = await generateToken({
            payload : {id: user._id, email, name: user.name, gender: user.gender},
            signature : user.role === userRoles.user ? process.env.USER_REFRESH_TOKEN : process.env.ADMIN_REFRESH_TOKEN,
            options : {expiresIn: "10d" , jwtid : nanoid()}
        })

        return res.status(200).json({message: "Successfully", accessToken, refreshToken});

    },

    conformEmail: async (req, res) => {

        const {token} = req.params;

        if (!token) {
            throw new Error("token missing", {cause: 400});
        }

        const decodedToken = await verifyToken({
            token: token ,
            signature : process.env.SEND_EMAIL_SECRET_KEY
        })

        // check for user
        const user = await userModel.findOne({email: decodedToken.email, conformed: false});

        if (!user) {
            throw new Error("User not found or already confirmed", {cause: 401})
        }

        user.conformed = true;

        await user.save();

        return res.status(200).json({massage: "user conformed successfully"});
    },

    logout : async (req, res , next) => {

        await revokeModel.create({
            tokenId: req.decodedToken.jti,
            expiresAt: req.decodedToken.exp,
        });

        return res.status(200).json({message: "Successfully logged out"});
    },

    refreshToken : async (req, res) => {

        const accessToken = await generateToken({
            payload : {id: req.user._id, email : req.user.email , name: req.user.name, gender: req.user.gender},
            signature : req.user.role === userRoles.user ? process.env.USER_ACCESS_TOKEN : process.env.ADMIN_ACCESS_TOKEN,
            options : {expiresIn: "1h" , jwtid : nanoid()}
        });
        const refreshToken = await generateToken({
            payload : {id: req.user._id, email : req.user.email , name: req.user.name, gender: req.user.gender},
            signature : req.user.role === userRoles.user ? process.env.USER_REFRESH_TOKEN : process.env.ADMIN_REFRESH_TOKEN,
            options : {expiresIn: "10d" , jwtid : nanoid()}
        })

        return res.status(200).json({message: "Token created successfully", accessToken, refreshToken});

    },


    updatePassword : async (req, res) => {

        const {oldPassword, newPassword} = req.body;

        const comparePasswords = await compareHash({
            cipherText : req.user.password,
            plainText : oldPassword,
        });

        if(!comparePasswords) {
            throw new Error("oldPassword not match" , {cause : 401});
        }

        req.user.password = await generateHash({
            plainText: newPassword,
            signature: Number(process.env.SALTROUNDS)
        });

        await req.user.save();


        return res.status(200).json({message: "Password updated successfully"});

    },

    forgotPassword : async (req, res) => {

        const {email} = req.body;

        const user = await userModel.findOne({email: email});

        if (!user) {
            throw new Error("user not found" , {cause : 404});
        }

        //generate OTP
        const otp = customAlphabet("0123456789" , 4)()

        eventEmitter.emit("forgetPassword" , {email , otp})

        user.otp = await generateHash({
            plainText: otp,
            signature: Number(process.env.SALTROUNDS)
        });

        await user.save();

        return res.status(200).json({message: "otp send successfully"});


    },


    resetPassword : async (req, res) => {

        const {email , otp , newPassword} = req.body;

        const user = await userModel.findOne({email: email , otp : {$exists: true}});

        if (!user) {
            throw new Error("user not found" , {cause : 404});
        }

        const compareOTP = await compareHash({
            cipherText : user?.otp,
            plainText : otp
        });

        if(!compareOTP) {
            throw new Error("invalid otp " , {cause : 404});
        }

        const hashedPassword = await generateHash({
            plainText: newPassword,
            signature : Number(process.env.SALTROUNDS)
        });

        await userModel.updateOne({
            email: email,
        }, {
            password: hashedPassword,
            $unset: {otp : ""}
        })





        return res.status(200).json({message: "Password reset successfully"});


    },




}


export default authService;









