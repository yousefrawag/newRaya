const missionSchema = require("../../model/missionSchema");
const addMission = async (req, res, next) => {
  const {
    title,
    status,
    assignedTo,
    project,
    deadline,
    missionType,
    description,
    Privetproject
  } = req.body;
  try {
    const newMission = await missionSchema.create({
      title,
      status,
      assignedTo,
      project,
      assignedBy: req.token.id,
      deadline,
      missionType,
      description,
      Privetproject
    });
    res
      .status(201)
      .json({ message: "mession created successfully", newMission });
  } catch (error) {
    next(error);
  }
};
module.exports = addMission;
