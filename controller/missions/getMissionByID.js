const missionSchema = require("../../model/missionSchema");

const getMissionByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const mission = await missionSchema
      .findById(id)
      .populate("assignedTo")
      .populate("project")
      .populate("assignedBy");
    if (!mission) {
      res.json({ message: "this mission doesn't exist" });
    }

    res.status(200).json({ mission });
  } catch (error) {
    next(error);
  }
};
module.exports = getMissionByID;
