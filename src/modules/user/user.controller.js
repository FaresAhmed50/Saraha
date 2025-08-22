import {Router} from "express";
import userService from "./user.services.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {authorization} from "../../middlewares/authorization.middleware.js";
import {userRoles} from "../../models/user.model.js";


const userRouter = Router();


// validatorMiddleware(getProfileValidator) ,
userRouter.route("/getProfile").get(  authMiddleware , authorization([userRoles.user]) , userService.getProfile);










export default userRouter;