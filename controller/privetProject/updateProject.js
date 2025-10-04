const cloudinary = require("../../middleware/cloudinary");
const PrivetprojectSchema = require("../../model/privetProjectschema");
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {status} = req.body
    // const {DeletImages , DeleteVideos} = req.body
    let  updateData = { ...req.body };
  // const deleted = JSON.parse(DeletImages)
  // const videDelete = JSON.parse(DeleteVideos)

    
    let project = await PrivetprojectSchema.findById(id);
    if (!project) {
      return res.status(404).json({ message: "This project desn't exist" });
    }
  
    const imagesURLs = project.imagesURLs;
    const videosURLs = project.videosURLs
    const docsURLs = project.docsURLs
    
    
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
      updateData.imagesURLs = imagesURLs;
      updateData.videosURLs = videosURLs;
      updateData.docsURLs = docsURLs;
    }

     updateData = {...updateData ,ArchievStatuts:status }
      console.log("log inside" , status);
  
    const updatedproject = await PrivetprojectSchema.findByIdAndUpdate(
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