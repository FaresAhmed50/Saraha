import {Router} from "express";
import authService from "./auth.service.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import {signInValidator, signUpValidator} from "../../validator/auth.validator.js";
import {authMiddleware, refreshTokenMiddleware} from "../../middlewares/auth.middleware.js";


const authRouter = Router();



authRouter.route("/signup").post( validatorMiddleware(signInValidator) , authService.signup);
authRouter.route("/signin").post( validatorMiddleware(signUpValidator) , authService.signin);
authRouter.route("/conformEmail/:token").get(authService.conformEmail);
authRouter.route("/logout").post( authMiddleware , authService.logout);
authRouter.route("/refreshToken").post( refreshTokenMiddleware , authService.refreshToken)


export default authRouter;