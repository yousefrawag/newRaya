const missionSchema = require("../../model/missionSchema");

const deleteMission = async (req, res, next) => {
  const { id } = req.params;
  try {
    await missionSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "delete mission successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteMission;
