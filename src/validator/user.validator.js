import Joi from "joi";
import {generalRules} from "../utilts/generalRules/generalRules.utilts.js";
import {userGender} from "../models/user.model.js";


export const getProfileValidator = {
    header : generalRules.header.required(),
}


export const updateProfileValidator = {
    body : Joi.object({
        name: Joi.string().alphanum().min(5).max(20),
        email: generalRules.email,
        phone: Joi.string(),
        gender: Joi.string().valid(userGender.male , userGender.female),
        age : Joi.number().min(12).max(60).integer().positive(),
    })
}
