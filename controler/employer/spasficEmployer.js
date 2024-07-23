const auth_Uther = require("../../model/userschema");
const missionSchema = require('../../model/missionschema')
const projectSchema = require('../../model/projectSchema')
const spasficEmployer = async (req , res) => {
    try {
        const {id}  =req.params
        const employer = await auth_Uther.findById(id).select("-password").populate("permissions")
        const mymission = await missionSchema.find({assignedTo:employer._id})
        const projects = await projectSchema.find({addingBy:employer._id})
        const formateemployer = {
            employer,
            mymission,
            projects
        }
        res.json({formateemployer})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = spasficEmployer