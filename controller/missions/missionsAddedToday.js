const missionSchema = require("../../model/missionSchema");

const missionsAddedToday = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const missions = await missionSchema
      .find({
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })
      .populate(["project", "assignedTo" , "Privetproject"]);
    return res.status(200).json({ missions });
  } catch (error) {
    next(error);
  }
};

module.exports = missionsAddedToday;
