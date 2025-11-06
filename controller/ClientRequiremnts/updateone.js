const ClientRequirementSchema = require("../../model/ClientRequirement")
const updateone = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await ClientRequirementSchema.findByIdAndUpdate(id , {
        ...req.body
    } , {new:true})
    res.status(200).json({mesg:"requirement updated " , updateNew});
}
module.exports = updateone