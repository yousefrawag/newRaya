const projectSchema = require("../../model/projectSchema");

const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    await projectSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteProject;
