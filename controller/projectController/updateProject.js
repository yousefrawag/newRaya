
const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const {DeletImages , DeleteVideos} = req.body
    const updateData = { ...req.body };
console.log("id" , id)
    
    let project = await projectSchema.findById(id);
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
    const admins = await userSchema.find({
  $or: [{ type: "admin" }, { role: 9 }]
});

      
          // ✅ Create notifications properly
          const notifications = admins.map((admin) => ({
            user: admin._id,  // Ensure this is a number if required
            employee: req.token?.id,
            levels: "projects",
            type: "update",
            allowed:updatedproject?._id,
            message: "تم تعديل خدمة عامة",
          }));
      
          // ✅ Save notifications
          await notificationSchema.insertMany(notifications);
  } catch (error) {
    next(error);
  }
};
module.exports = updateProject;
