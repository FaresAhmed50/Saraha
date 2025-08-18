import mongoose from 'mongoose';


const dbConnection = await mongoose.connect("mongodb://localhost:27017/saraha")
    .then(() => {
            console.log("MongoDB Connected!");
        }
    ).catch((err) => {
        console.log(err);
    });



export default dbConnection;
