import {Router} from "express";
import userServices from "./user.services.js";


const userRouter = Router();


userRouter.route("/signup").post(userServices.signup);
userRouter.route("/signin").post(userServices.signin);










export default userRouter;