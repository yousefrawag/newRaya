const missionSchema = require('../../model/missionschema')
// add mission
const Addmission = async (req , res) =>{
 
    const {title , assignedTo , project , missionType  , description , watch , edit , deleteMission , missionComplate  ,inprosess} = req.body
    try {
        const newMission = await missionSchema.create({
            title , 
            assignedTo , 
            project  
            ,description , 
            watch , edit , 
            deleteMission ,
            missionComplate ,
            missionType,
             inprosess,
             addingBy:req.user._id
        })
        res.json(newMission)
    } catch (error) {
        res.send(error)
    }
  

}
module.exports = Addmission