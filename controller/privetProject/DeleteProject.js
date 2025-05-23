const cloudinary = require("../../middleware/cloudinary");
const PrivetprojectSchema = require("../../model/privetProjectschema");

const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await PrivetprojectSchema.findById(id);
    if (!project) {
     return res.status(404).json({ message: "Project doesn't exist" });
    }
    for (const index in project.imagesURLs) {
      let { fileID } = project.imagesURLs[index];
      await cloudinary.delete(fileID);
    }
    for (const index in project.videosURLs) {
      let { fileID } = project.videosURLs[index];
      await cloudinary.delete(fileID);
    }
    for (const index in project.docsURLs) {
      let { fileID } = project.docsURLs[index];
      await cloudinary.delete(fileID);
    }
    await PrivetprojectSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteProject;
