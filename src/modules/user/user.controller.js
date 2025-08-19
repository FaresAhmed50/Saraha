import {Router} from "express";
import userServices from "./user.services.js";
import userService from "./user.services.js";


const userRouter = Router();



userRouter.route("/getProfile").get(userService.getProfile);










export default userRouter;