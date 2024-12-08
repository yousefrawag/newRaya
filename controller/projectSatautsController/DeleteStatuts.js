const projectStatuts = require("../../model/projectStatuts")

const DeleteStatuts = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await projectStatuts.findById(id)
    if(currentcurrency) {
        await projectStatuts.findByIdAndDelete(id)
       return res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DeleteStatuts