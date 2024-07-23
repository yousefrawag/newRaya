const permissionschema = require('../../model/permissionsschema')
const DeletePermission  = async (req , res) =>{
    try {
        const {id} = req.params
        await permissionschema.findByIdAndDelete(id)
        res.json({mesg:"permissions deleted successfully"})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = DeletePermission