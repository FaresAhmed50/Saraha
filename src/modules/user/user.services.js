import {decryptUtilits} from "../../utilts/Encryption/decrypt.utilits.js";

const userServices = {

    getProfile: async (req, res) => {

        req.user.phone = await decryptUtilits({
            cipherText: req.user.phone,
            signature: process.env.PHONE_ENCRYPTION
        });

        req.user.password = undefined;

        return res.status(200).json({message: "Successfully retrieved user", user: req.user})
    }

};









export default userServices;