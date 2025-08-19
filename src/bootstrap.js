import dbConnection from "./dbConnection/dbConnection.js";
import userRouter from "./modules/user/user.controller.js";
import massageRouter from "./modules/massage/massage.controller.js";
import authRouter from "./modules/auth/auth.controller.js";


const bootstrap = ({app , express}) => {





    app.use(express.json());

    dbConnection();



    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/massage", massageRouter);



    app.use( "{/*demo}" , (req, res) => {
        return res.status(404).send(`url Not Found ${req.originalUrl}`);
    })

};






export default bootstrap;