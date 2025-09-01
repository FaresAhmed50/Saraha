import dbConnection from "./dbConnection/dbConnection.js";
import userRouter from "./modules/user/user.controller.js";
import massageRouter from "./modules/massage/massage.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import {globalErrorHandler} from "./middlewares/errorHandler.middleware.js";
import {rateLimit} from "express-rate-limit"
import cors from "cors"
import helmet from "helmet"


const bootstrap = ({app , express}) => {


    const wishList = [undefined];
    const crosOptions = {
        original : (origin , callback) => {
            if(wishList.includes(origin )){
                callback(null, true)
            }else {
                callback(new Error("cros not allowed."));
            }
        }
    };

    const limiter = rateLimit({
        windowMs: 60*1000,
        max: 5,
        skipSuccessfulRequests: true
    });


    app.use(cors(crosOptions))
    app.use(limiter);
    app.use(helmet());
    app.use(express.json());



    dbConnection();


    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/massage", massageRouter);



    app.use( "{/*demo}" , (req, res) => {
        throw new Error(`url Not Found ${req.originalUrl}` , {cause : 404})
    })

    app.use(globalErrorHandler)

};






export default bootstrap;