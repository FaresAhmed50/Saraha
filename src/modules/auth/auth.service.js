import userModel, {userRoles} from "../../models/user.model.js";
import {generateToken , verifyToken , generateHash , compareHash , generateEncryption , eventEmitter} from "../../utilts/utilits.js"


const authService = {

    signup: async (req, res) => {

        const {name, email, password, age, phone, gender} = req.body;

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
            options : {expiresIn: "1h"}
        });
        const refreshToken = await generateToken({
            payload : {id: user._id, email, name: user.name, gender: user.gender},
            signature : user.role === userRoles.user ? process.env.USER_REFRESH_TOKEN : process.env.ADMIN_REFRESH_TOKEN,
            options : {expiresIn: "10d"}
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
    }

}


export default authService;









