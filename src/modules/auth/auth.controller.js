import {Router} from "express";
import authService from "./auth.service.js";


const authRouter = Router();



authRouter.route("/signup").post(authService.signup);
authRouter.route("/signin").post(authService.signin);




export default authRouter;