const projectSchema = require('../../model/projectSchema')

const UserProjects = async (req, res) =>{
    const {id} = req.params
    try {
        const userProjects = await projectSchema.find({addingBy:id}).populate("addingBy")
        res.json({userProjects})
    } catch (error) {
        res.send(error)
    }
 
}
module.exports = UserProjects