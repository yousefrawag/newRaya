const auth_Uther = require("../../model/userschema");
const GetallEmployer = async (req , res) => {
    try {
        const employer = await auth_Uther.find({role:"employer"}).select("-password").populate("permissions")
        if(employer.length === 0){
           return res.json({mesg:"there is no employer add"})
        }
        const formateemployer = employer.map((iteam) => {
            return {
                id:iteam._id,
                name:iteam.name,
                email:iteam.email,
                image:iteam.image,
                role:iteam.role,
                permissionsName:iteam?.permissions?.permissionName
    
            }
        })
      return  res.json({formateemployer})
    } catch (error) {
        res.send(error.message)
    }
 
}
module.exports = GetallEmployer