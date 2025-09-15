const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await projectSchema.findById(id);
    if (!project) {
    return  res.status(404).json({ message: "Project doesn't exist" });
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
    await projectSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "project deleted successfully" });
    const admins = await userSchema.find({
  $or: [{ type: "admin" }, { role: 9 }]
});

              // ✅ Create notifications properly
              const notifications = admins.map((admin) => ({
                user: admin._id,  // Ensure this is a number if required
                employee: req.token?.id,
                levels: "projects",
                type: "delete",
                allowed:id,
                message: "تم حذف خدمة عامة",
              }));
          
              // ✅ Save notifications
              await notificationSchema.insertMany(notifications);
  } catch (error) {
    next(error);
  }
};
module.exports = deleteProject;
