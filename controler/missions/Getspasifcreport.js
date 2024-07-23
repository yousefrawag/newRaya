const missionSchema = require('../../model/missionschema')

const Getspasifcreport = async (req ,res) => {
    const {id} = req.params
    try {
        const sinagleReport = await missionSchema.findById(id).populate('assignedTo').populate("project")
        if(sinagleReport){
            res.json({sinagleReport})
        }else{
            res.json({mesg:"this report is andefind in db"})
        }
    } catch (error) {
        res.send(error)
    }
}
module.exports = Getspasifcreport