import dbConnection from "./dbConnection/dbConnection";


const bootstrap = ({app , express}) => {





    app.use(express.json());

    dbConnection();


    app.use("/users", userRouter);
    app.use("/massage", massageRouter);











    app.use( "{/*demo}" , (req, res) => {
        return res.status(404).send(`url Not Found ${req.originalUrl}`);
    })

};






export default bootstrap;