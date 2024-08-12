const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updateData = { ...req.body };
    let project = await projectSchema.findById(id);
    if (!project) {
      return res.status(404).json({ message: "This project desn't exist" });
    }
    if (req.files) {
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
      const imagesURLs = [];
      const videosURLs = [];
      const docsURLs = [];
      for (const index in req.files) {
        if (
          req.files[index].mimetype === "image/png" ||
          req.files[index].mimetype === "image/jpeg"
        ) {
          const { imageURL: fileURL, imageID: fileID } =
            await cloudinary.upload(
              req.files[index].path,
              "projectFiles/images"
            );
          imagesURLs.push({ fileURL, fileID });
        } else if (req.files[index].mimetype === "video/mp4") {
          const { imageURL: fileURL, imageID: fileID } =
            await cloudinary.upload(
              req.files[index].path,
              "projectFiles/videos"
            );
          videosURLs.push({ fileURL, fileID });
        } else if (req.files[index].mimetype === "application/pdf") {
          const { imageURL: fileURL, imageID: fileID } =
            await cloudinary.upload(req.files[index].path, "projectFiles/docs");
          docsURLs.push({ fileURL, fileID });
        }
      }
      project.imagesURLs = imagesURLs;
      project.videosURLs = videosURLs;
      project.docsURLs = docsURLs;
    }
    updateData.addedBy = req.token.id;
    const updatedproject = await projectSchema.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "project updated successfully", updatedproject });
  } catch (error) {
    next(error);
  }
};
module.exports = updateProject;
