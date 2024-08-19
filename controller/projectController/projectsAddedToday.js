const projectSchema = require("../../model/projectSchema");

const projectsAddedToday = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const projects = await projectSchema
      .find({
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })
      .populate("addedBy");
    return res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

module.exports = projectsAddedToday;
