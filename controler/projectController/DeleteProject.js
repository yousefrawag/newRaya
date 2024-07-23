const projectSchema = require('../../model/projectSchema')

const DeleteProject = async (req , res) => {
    const {id}  = req.params
    try {
        await projectSchema.findByIdAndDelete(id)
        res.json({mesg:"project deleted successfully"})
    } catch (error) {
        res.send(error)
    }
   
}
module.exports = DeleteProject