const missionSchema = require("../../model/missionSchema");

const updateMission = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    status,
    assignedTo,
    project,
    deadline,
    missionType,
    description,
  } = req.body;
  try {
    const updateMission = await missionSchema.findByIdAndUpdate(
      id,
      {
        title,
        status,
        assignedTo,
        project,
        assignedBy: req.token.id,
        deadline,
        missionType,
        description,
      },
      { new: true }
    );
    res.status(200).json({ message: "updated successfully", updateMission });
  } catch (error) {
    next(error);
  }
};
module.exports = updateMission;
