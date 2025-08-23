import Joi from 'joi';
import {userGender} from "../models/user.model.js";
import {generalRules} from "../utilts/generalRules/generalRules.utilts.js";


export const signInValidator = {
    body : Joi.object({
        name: Joi.string().alphanum().min(5).max(20).required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        conformedPassword : Joi.string().valid(Joi.ref("password")),
        phone: Joi.string().required(),
        gender: Joi.string().valid(userGender.male , userGender.female).required(),
        age : Joi.number().min(12).max(60).integer().positive().required(),
        role : Joi.string().required(),
        image : Joi.string().required(),
    }).with("password" , "conformedPassword")
}


export const signUpValidator = {
    body : Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).options({presence : "required"})
}


export const updatePasswordValidator = {
    body : Joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    })
};


export const forgetPasswordValidator = {
    body : Joi.object({
       email: generalRules.email.required(),
    })
};


export const resetPasswordValidator = {
    body : Joi.object({
        email: generalRules.email.required(),
        otp : Joi.string().length(4).required(),
        newPassword : generalRules.password.required(),
    })
}