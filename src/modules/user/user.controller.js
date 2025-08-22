import {Router} from "express";
import userServices from "./user.services.js";
import userService from "./user.services.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import {getProfileValidator} from "../../validator/user.validator.js";


const userRouter = Router();


// validatorMiddleware(getProfileValidator) ,
userRouter.route("/getProfile").get(  authMiddleware , userService.getProfile);










export default userRouter;