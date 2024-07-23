const missionSchema = require('../../model/missionschema')

const Getallmission = async (req  ,res) =>{
    try {
        const allmissions = await missionSchema.find({}).populate('assignedTo').populate("addingBy")
        res.json({allmissions})
    } catch (error) {
        res.send(error)
    }
}
module.exports = Getallmission