import {Router} from "express";
import massageServices from "./massage.services.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {getMassageValidator} from "../../validator/massage.validator.js";

const massageRouter = Router({caseSensitive: true , strict : true});



massageRouter.route("/addMassage").post( validatorMiddleware() , massageServices.addMassage)
massageRouter.route("/getAllMassage").get( authMiddleware , massageServices.getAllMassage)
massageRouter.route("/getMassage/:id").get( validatorMiddleware(getMassageValidator) , authMiddleware , massageServices.getMassage)














export default massageRouter;