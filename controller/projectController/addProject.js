const projectSchema = require("../../model/projectSchema");
const cloudinary = require("../../middleware/cloudinary");

const addProject = async (req, res, next) => {
  try {
    let project = new projectSchema(req.body);
    project.addedBy = req.token.id;
    const imagesURLs = [];
    const videosURLs = [];
    const docsURLs = [];
    if (req.files) {
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
    }
    project.imagesURLs = imagesURLs;
    project.videosURLs = videosURLs;
    project.docsURLs = docsURLs;
    project.projectName = project.projectName.trim()
    await project.save();
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};
module.exports = addProject;
