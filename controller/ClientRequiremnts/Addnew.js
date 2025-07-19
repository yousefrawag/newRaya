const ClientRequirementSchema = require("../../model/ClientRequirement")
const AddNew = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await ClientRequirementSchema.create({name})
       return res.status(200).json({mesg:"requiremnts add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddNew