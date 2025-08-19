import {Router} from "express";
import userServices from "./user.services.js";
import userService from "./user.services.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";


const userRouter = Router();



userRouter.route("/getProfile").get(authMiddleware , userService.getProfile);










export default userRouter;