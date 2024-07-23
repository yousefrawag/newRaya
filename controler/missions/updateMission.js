const missionSchema = require('../../model/missionschema')

const updateMission = async (req ,res) => {
const {id} = req.params
const {title , assignedTo , project , missionType  , description , watch , edit , deleteMission , missionComplate  ,inprosess} = req.body
try {
    const updateMission = await missionSchema.findByIdAndUpdate(id , {
        title , assignedTo , project , 
        missionType  , description 
        , watch , edit , deleteMission
         , missionComplate  ,inprosess
    } , {new:true})
    res.json({updateMission})
} catch (error) {
    res.send(error)
}
  

}
module.exports = updateMission