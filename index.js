import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import bootstrap from "./src/bootstrap.js";
const app = express();

const port = process.env.PORT || 3000;



bootstrap({app , express});






app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})