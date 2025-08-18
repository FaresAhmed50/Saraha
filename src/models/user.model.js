import mongoose from "mongoose";


export const userGender = {
    male: "male",
    female: "female",
}


const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 10
    },
    email : {
        type: String,
        required: true,
        unique : true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    image : String,
    phone : {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: Object.values(userGender),
        default: userGender.male ,
    },
    age : {
        type: Number,
        required: true,
        min: 0,
        max: 60,
    },
    conformed : {
        type : Boolean,
        default: false
    }
}, {
    timestamps: true
});




const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;