import Joi from "joi";
import {Types} from "mongoose";


const costumeId = (value , helper) => {
    const data = Types.ObjectId.isValid(value);
    return data ? value : helper.massage("invalid Id")
}


export const generalRules = {
    id : Joi.string().custom(costumeId),
    email: Joi.string().email(),
    password: Joi.string(),
    header : Joi.object({
        authorization : Joi.string().required(),
        host : Joi.string().required(),
        "accept-encoding" : Joi.string(),
        "content-type" : Joi.string(),
        "content-length" : Joi.string(),
        "connection" : Joi.string(),
        "user-agent" : Joi.string(),
        "accept" : Joi.string(),
        "cache-control" : Joi.string(),
        "postman-token" : Joi.string(),

    })

}