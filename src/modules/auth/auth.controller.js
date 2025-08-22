import {Router} from "express";
import authService from "./auth.service.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import {signInValidator, signUpValidator} from "../../validator/auth.validator.js";


const authRouter = Router();



authRouter.route("/signup").post( validatorMiddleware(signInValidator) , authService.signup);
authRouter.route("/signin").post( validatorMiddleware(signUpValidator) , authService.signin);
authRouter.route("/conformEmail/:token").get(authService.conformEmail);




export default authRouter;