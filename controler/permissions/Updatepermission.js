const permissionschema = require('../../model/permissionsschema')
const Updatepermission = async (req ,res) => {
    try {
        const {id} = req.params
       const { permissionName, details,   pagePermissions} =  req.body
        const updatePermission = await permissionschema.findByIdAndUpdate(id ,{
            permissionName,
            details,
            pagePermissions
        } ,{new:true})
        res.json({updatePermission})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Updatepermission