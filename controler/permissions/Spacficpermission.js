const userSchema = require('../../model/userschema')
const permissionschema = require("../../model/permissionsschema")
const Spacficpermission = async (req , res) =>{
    try {
        const {id} = req.params
        const currentPermission = await permissionschema.findById(id)
        const userIncludePermission = await userSchema.find({permissions:id})
        res.json({permissionsName:currentPermission.permissionName , users:userIncludePermission})
        
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Spacficpermission