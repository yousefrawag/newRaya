const missionSchema = require('../../model/missionschema')
const userMission = async (req , res) => {
    try {
                const mission = await missionSchema.find({assignedTo:req.user._id}).populate("assignedTo")
                res.json({mission})

    } catch (error) {
        res.send(error.message)
    }

}
module.exports = userMission






    //     // const mission = await missionSchema.find({assignedTo}).populate("assignedTo")
