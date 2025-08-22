import mongoose from 'mongoose';


const dbConnection = async () => {
    await mongoose.connect(process.env.DBURL)
        .then(() => {
                console.log("MongoDB Connected!");
            }
        ).catch((err) => {
            console.log(err);
        });
}

export default dbConnection;
