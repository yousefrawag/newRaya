const ClientRequirementSchema = require("../../model/ClientRequirement")
const DeleteRequire = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await ClientRequirementSchema.findById(id)
    if(currentcurrency) {
        await ClientRequirementSchema.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"DeleteRequire deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DeleteRequire