const auth_Uther = require("../../model/userschema");
const DeleteEmployer = async (req , res) =>{
    try {
        const {id} = req.params
        await auth_Uther.findByIdAndDelete(id)
        res.json({mesg:"expenses deleted successfully"})
    } catch (error) {
        res.send(error)
    }  
}
module.exports = DeleteEmployer