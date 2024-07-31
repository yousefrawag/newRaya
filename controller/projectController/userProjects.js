const projectSchema = require("../../model/projectSchema");

const userProjects = async (req, res) => {
  const { id } = req.params;
  try {
    const userProjects = await projectSchema.find({ addedBy: id });
    res.status(200).json({ userProjects });
  } catch (error) {
    next(error);
  }
};
module.exports = userProjects;
