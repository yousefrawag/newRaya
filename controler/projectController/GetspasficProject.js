const projectSchema = require('../../model/projectSchema')
const missionSchema = require('../../model/missionschema')
const GetspasficProject = async (req, res) => {
    try {
        const {id} = req.params
    const project  = await projectSchema.findById(id)
    const projectMission = await missionSchema.find({project:id}).populate("assignedTo")
    res.json({project , projectMission})
    } catch (error) {
        res.send(error.message)
    }

}
module.exports = GetspasficProject