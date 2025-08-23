import {Router} from "express";
import userService from "./user.services.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {authorization} from "../../middlewares/authorization.middleware.js";
import {userRoles} from "../../models/user.model.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import {updateProfileValidator} from "../../validator/user.validator.js";


const userRouter = Router();


// validatorMiddleware(getProfileValidator) ,
userRouter.route("/getProfile").get(  authMiddleware , authorization([userRoles.user]) , userService.getProfile);
userRouter.route("/updateProfile").patch(authMiddleware , validatorMiddleware(updateProfileValidator) , userService.updateProfile)










export default userRouter;