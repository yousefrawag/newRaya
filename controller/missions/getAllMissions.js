const missionSchema = require("../../model/missionSchema");

const getAllMission = async (req, res, next) => {
  try {
    const allmissions = await missionSchema
      .find({})
      .populate("assignedTo")
      .populate("project")
      .populate("assignedBy");
    res.json({ allmissions });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMission;
