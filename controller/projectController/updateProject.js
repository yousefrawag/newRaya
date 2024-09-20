
const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {DeletImages , DeleteVideos} = req.body
    const updateData = { ...req.body };
  const deleted = JSON.parse(DeletImages)
  const videDelete = JSON.parse(DeleteVideos)
  console.log(videDelete);
    const filesDelete = [...videDelete , ...deleted]
    
    let project = await projectSchema.findById(id);
    if (!project) {
      return res.status(404).json({ message: "This project desn't exist" });
    }
    if (Array.isArray(filesDelete)) {
      for (const image of filesDelete) {
        const { fileID } = image;
        if (fileID) {
          const publicId = fileID.split('/').pop().split('.')[0];
          console.log(`Attempting to delete image with fileID: ${fileID}`);
          try {
        
            await cloudinary.delete(publicId);
            console.log(`Successfully deleted image with fileID: ${publicId}`);
            project.imagesURLs = project.imagesURLs.filter(
              (img) => img.fileID !== fileID
            );
            project.videosURLs = project.videosURLs.filter(
              (vid) => vid.fileID !== fileID
            );
            project.docsURLs = project.docsURLs.filter(
              (doc) => doc.fileID !== fileID
            );
          } catch (err) {
            console.error(`Error deleting image with fileID ${publicId}:`, err);
            return res.status(500).json({ message: `Error deleting image with fileID ${publicId}` });
          }
        }
      }
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
    if (updateData.imageLink){
    
      const newimagelink = {fileID: new Date() , fileURL : updateData.imageLink}
      updateData.imagesURLs.push(newimagelink)
    }
    if (updateData.videoLink){
    
      const newimagelink = {fileID: new Date() , fileURL : updateData.videoLink}
      updateData.videosURLs.push(newimagelink)
    }
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
