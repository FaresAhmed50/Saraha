import userModel from "../../models/user.model.js";
import massageModel from "../../models/massage.model.js";


const massageServices = {

    addMassage: async (req, res) => {

        const {userId , content} = req.body;

        // user Exsists
        const userExsisit = await userModel.findOne({
            _id: userId,
            isDeleted: {$exists: false}
        })

        if(!userExsisit){
            throw new Error("User not found or the accout is freeze" , {cause : 401})
        }

        const userMassage = await massageModel.create({userId , content});

        return res.status(200).json({ massage : "massage created susefully", userMassage});

    }

}




export default massageServices;