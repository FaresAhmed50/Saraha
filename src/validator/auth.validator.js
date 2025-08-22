import Joi from 'joi';
import {userGender} from "../models/user.model.js";
import {generalRules} from "../utilts/generalRules/generalRules.utilts.js";


export const signInValidator = {
    body : Joi.object({
        name: Joi.string().alphanum().min(5).max(20),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        conformedPassword : Joi.string().valid(Joi.ref("password")),
        phone: Joi.string(),
        gender: Joi.string().valid(userGender.male , userGender.female),
        age : Joi.number().min(12).max(60).integer().positive(),
        role : Joi.string(),
    }).with("password" , "conformedPassword").options({presence : "required"})
}


export const signUpValidator = {
    body : Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).options({presence : "required"})
}