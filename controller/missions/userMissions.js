const missionSchema = require("../../model/missionSchema");
const userMissions = async (req, res, next) => {
  try {
    const missions = await missionSchema
      .find({ assignedTo: req.params.id })
      .populate("assignedBy")
      .populate("project");
    res.json({ missions });
  } catch (error) {
    res.send(error.message);
  }
};
module.exports = userMissions;
