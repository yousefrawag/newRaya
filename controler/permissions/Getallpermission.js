const permissionschema = require('../../model/permissionsschema')
const userSchema = require('../../model/userschema')
const Getallpermission = async (req ,res) => {
    try {
        const allPermissions = await permissionschema.find({})
        const formatPermissions = await Promise.all( allPermissions.map(async(iteam) => {
            const userCount = await userSchema.find({permissions:iteam._id})
            return {
                id:iteam._id,
                permaionName:iteam.permissionName,
                details:iteam.details,
                userCount:userCount.length + 1
            }
        }))
        
        res.json({formatPermissions})
    } catch (error) {
        res.send(error.message)
    }
   
}
module.exports = Getallpermission