const projectlocationschema = require("../../model/ProjectLocationschema")

const Deletelocation = async (req , res) => {
    const {id} = req.params
    const currentregion = await projectlocationschema.findById(id)
    if(currentregion) {
        await projectlocationschema.findByIdAndDelete(id)
       return res.status(200).json({mesg:"location deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = Deletelocation