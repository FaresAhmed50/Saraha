import {decryptUtilits, eventEmitter, generateEncryption} from "../../utilts/utilits.js";
import userModel from "../../models/user.model.js";

const userServices = {

    getProfile: async (req, res) => {

        req.user.phone = await decryptUtilits({
            cipherText: req.user.phone,
            signature: process.env.PHONE_ENCRYPTION
        });

        req.user.password = undefined;

        return res.status(200).json({message: "Successfully retrieved user", user: req.user})
    },


    updateProfile : async (req, res) => {

        const {name , email , phone , age , gender} = req.body;

        if(name) req.user.name = name;
        if(age) req.user.age = age;
        if(gender) req.user.gender = gender;
        if(phone) {
            req.user.phone = await generateEncryption({
                planeText: phone,
                signature: process.env.PHONE_ENCRYPTION
            });
        }

        if(email) {
            const user = await userModel.findOne({email});

            if (user) {
                throw new Error("Email already exists" , {cause : 404});
            }

            eventEmitter.emit("sendEmail", {email});

            req.user.email = email;
            req.user.conformed = false;

        }


        await req.user.save();

        return res.status(200).json({message: "Successfully updated user", user: req.user})

    },

    getSpecificProfile : async (req, res) => {

        const {id} = req.params;

        const user = await userModel.findById(id).select("name email age gender");

        if(user) {
            throw new Error("User already exists");
        }

        return res.status(200).json({massage : "user found", user})





    }

};









export default userServices;