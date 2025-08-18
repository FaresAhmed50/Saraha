import {Router} from "express";
import userServices from "./user.services.js";


const userRouter = Router();


userRouter.route("/signup").post(userServices.signup);










export default userRouter;