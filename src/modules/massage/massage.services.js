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

    },

    getAllMassage : async (req, res) => {

        const massages = await massageModel.find({
            userId : req?.user?._id,
        }).populate([
            {
                path: "userId",
                select: "name"
            }
        ])


        return res.status(200).json({ massage : "success" , massages });

    },


    getMassage : async (req, res) => {

        const {id} = req.params;

        const userMassage = await massageModel.find({
            userId : req?.user?._id,
            _id : id
        });

        if(!userMassage){
            throw new Error("massage does not exist" , {cause : 400});
        }

        return res.status(200).json({ massage : "success" , userMassage });
    }

}




export default massageServices;