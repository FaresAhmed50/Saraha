import {Router} from "express";
import authService from "./auth.service.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import {
    forgetPasswordValidator, resetPasswordValidator,
    signInValidator,
    signUpValidator, updatePasswordValidator
} from "../../validator/auth.validator.js";
import {authMiddleware, refreshTokenMiddleware} from "../../middlewares/auth.middleware.js";


const authRouter = Router();



authRouter.route("/signup").post( validatorMiddleware(signInValidator) , authService.signup);
authRouter.route("/signin").post( validatorMiddleware(signUpValidator) , authService.signin);
authRouter.route("/conformEmail/:token").get(authService.conformEmail);
authRouter.route("/logout").post( authMiddleware , authService.logout);
authRouter.route("/refreshToken").post( refreshTokenMiddleware , authService.refreshToken);
authRouter.route("/updatePassword").patch( validatorMiddleware(updatePasswordValidator) ,  authMiddleware , authService.updatePassword);
authRouter.route("/forgetPassword").patch( validatorMiddleware(forgetPasswordValidator) , authService.forgotPassword);
authRouter.route("/resetPassword").patch( validatorMiddleware(resetPasswordValidator) , authService.resetPassword);

export default authRouter;