const missionSchema = require("../../model/missionSchema");

const getAllMission = async (req, res, next) => {
  try {
    const {assignedTo , project  ,  assignedBy  , status ,  missionType} = req.query
    let filter = {}
    if(assignedTo) {
      filter = {...filter , assignedTo}
    }
    if(project) {
      filter = {...filter , project}
    }
    if(assignedBy) {
      filter = {...filter , assignedBy}
    }
    if(status) {
      filter = {...filter , status}
    }
    if(missionType) {
      filter = {...filter , missionType}
    }
    const allmissions = await missionSchema
      .find(filter)
      .populate("assignedTo")
      .populate("project")
      .populate("assignedBy")
      .sort({ createdAt: -1 })
    res.json({ allmissions });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMission;
