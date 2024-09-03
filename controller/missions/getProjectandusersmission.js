const missionSchema = require("../../model/missionSchema");

const getProjectandusersmission = async (req, res, next) => {
  try {
 
    const allmissions = await missionSchema
      .find({})
      .populate("assignedTo")
      .populate("project")
      .populate("assignedBy");
      const projects = [...new Set(allmissions.map(mission => mission.project))]
      const assignedTo = [...new Set(allmissions.map(mission => mission.assignedTo))]
      const assignedBy = [...new Set(allmissions.map(mission => mission.assignedBy))]
    res.json({ projects , assignedTo  , assignedBy });
  } catch (error) {
    throw new Error(error.message)
    next(error);
  }
};
module.exports = getProjectandusersmission;
