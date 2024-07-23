const permissionschema = require('../../model/permissionsschema')
const Addpermission = async (req ,res) => {
    try {
        const {permissionName , pagePermissions , details } = req.body
        const foundPermissions = await permissionschema.find({permissionName:permissionName})
        if(foundPermissions.length){
          return  res.send("this permission was aded before ")
        }else{
        const newpermission = await permissionschema.create({
            permissionName,
            details,
            pagePermissions
        })
       return res.json({newpermission})}
    } catch (error) {
       return res.send(error.message)
    }
 
}
module.exports = Addpermission