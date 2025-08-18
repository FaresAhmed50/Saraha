import mongoose from "mongoose";




const massageSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true,
        minLength : 1 ,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

} , {
    timestamps: true,
});


const massageModel = mongoose.models.Massage || mongoose.model("Massage", massageSchema);