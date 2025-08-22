import mongoose from "mongoose";


const revokeTokenSchema = mongoose.Schema({
    tokenId : {
        type: String,
        required: true,
    },
    expiresAt : {
        type: String,
        required: true,
    }
});




const revokeModel = mongoose.models.RevokeToken || mongoose.model("RevokeToken" , revokeTokenSchema);

export default revokeModel;