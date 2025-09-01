import Joi from "joi";
import {generalRules} from "../utilts/generalRules/generalRules.utilts.js";


export const addMassageValidator = {
    body : Joi.object({
        userId : generalRules.id,
        content : Joi.string().min(1).required()
    }).required(),
}

export const getMassageValidator = {
    params : Joi.object({
        id : generalRules.id.required()
    }).required(),
}