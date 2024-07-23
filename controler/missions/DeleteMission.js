const missionSchema = require('../../model/missionschema')

const DeleteMission = async (req ,res) => {
    const {id} = req.params
    try {
        await missionSchema.findByIdAndDelete(id)
        res.json({mesg:"delete mission successfully"})
    } catch (error) {
        res.send(error)
    }
}
module.exports = DeleteMission