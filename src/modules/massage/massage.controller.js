import {Router} from "express";
import massageServices from "./massage.services.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";

const massageRouter = Router();



massageRouter.route("/addMassage").post( validatorMiddleware() , massageServices.addMassage)















export default massageRouter;