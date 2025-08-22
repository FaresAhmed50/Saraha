import userModel from "../models/user.model.js";
import {verifyToken} from "../utilts/Token/verifyToken.utilits.js";
import revokeModel from "../models/revoke.model.js";


export const authMiddleware = async (req, res, next) => {


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
            signature = process.env.USER_ACCESS_TOKEN;
            break;
        case "Admin":
            signature = process.env.ADMIN_ACCESS_TOKEN;
            break;
        default:
            throw new Error("invalid prefix", {cause: 400})
    }

    // decode access token
    const decodedToken = await verifyToken({
        token: token,
        signature: signature,
    });

    const revokeToken = await revokeModel.findOne({
        tokenId : decodedToken.jti,
    });

    if(revokeToken) {
        throw new Error("the token is invalid" , {cause : 401})
    }

    // check for user
    const user = await userModel.findById(decodedToken.id);
    if (!user) {
        throw new Error("User not found", {cause: 401});
    }

    req.decodedToken = decodedToken;
    req.user = user;

    return next();

}


















