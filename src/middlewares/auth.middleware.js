import CryptoJS from "crypto-js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const authMiddleware = async (req, res, next) => {


    console.log(req.headers);
    const authorization = req.headers["authorization"];


    if (!authorization) {
        throw new Error("No token provided", {cause: 404})
    }

    const [prefix, token] = authorization.split(" ");

    if (!token || !prefix) {
        throw new Error("invalid token provided or invalid prefix", {cause: 404});
    }

    let signature = "";

    switch (prefix) {
        case "Bearer":
            signature = "saraha_accessToken_user";
            break;
        case "Admin":
            signature = "saraha_accessToken_admin";
            break;
        default:
            throw new Error("invalid prefix", {cause: 400})
    }

    // decode access token
    const decodedToken = jwt.verify(token, signature);

    // check for user
    const user = await userModel.findById(decodedToken.id);
    if (!user) {
        throw new Error("User not found", {cause: 401});
    }

    req.user = user;

    return next();

}


















