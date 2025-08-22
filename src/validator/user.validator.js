import Joi from "joi";
import {generalRules} from "../utilts/generalRules.utilts.js";


export const getProfileValidator = {
    header : generalRules.header.required(),
}