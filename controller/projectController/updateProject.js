
const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const allowedTypes = [
      "application/pdf",
      "application/zip",
      "application/x-rar-compressed",
      "application/msword",
      "application/octet-stream",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const updateData = { ...req.body };
console.log("boday" , req.body);

    let project = await projectSchema.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "This project doesn't exist",
      });
    }

    /*
    =========================================
    PROJECT FILES
    =========================================
    */

    const imagesURLs = [...project.imagesURLs];
    const videosURLs = [...project.videosURLs];
    const docsURLs = [...project.docsURLs];

    if (req.files?.length > 0) {
      for (const file of req.files) {
        /*
        ==============================
        PROJECT IMAGE
        ==============================
        */

        if (
          file.fieldname === "projectFiles" &&
          (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
          )
        ) {
          const {
            imageURL: fileURL,
            imageID: fileID,
          } = await cloudinary.upload(
            file.path,
            "projectFiles/images"
          );

          imagesURLs.push({
            fileURL,
            fileID,
          });
        }

        /*
        ==============================
        PROJECT VIDEO
        ==============================
        */

        else if (
          file.fieldname === "projectFiles" &&
          file.mimetype === "video/mp4"
        ) {
          const {
            imageURL: fileURL,
            imageID: fileID,
          } = await cloudinary.upload(
            file.path,
            "projectFiles/videos"
          );

          videosURLs.push({
            fileURL,
            fileID,
          });
        }

        /*
        ==============================
        PROJECT DOCS
        ==============================
        */

        else if (
          file.fieldname === "projectFiles" &&
          allowedTypes.includes(file.mimetype)
        ) {
          const {
            imageURL: fileURL,
            imageID: fileID,
          } = await cloudinary.upload(
            file.path,
            "projectFiles/docs",
            {
              resource_type: "raw",
            }
          );

          docsURLs.push({
            fileURL,
            fileID,
          });
        }
      }
    }

    updateData.imagesURLs = imagesURLs;
    updateData.videosURLs = videosURLs;
    updateData.docsURLs = docsURLs;

    /*
    =========================================
    LINKS
    =========================================
    */

    if (updateData.imageLink) {
      updateData.imagesURLs.push({
        fileID: new Date().toString(),
        fileURL: updateData.imageLink,
      });
    }

    if (updateData.videoLink) {
      updateData.videosURLs.push({
        fileID: new Date().toString(),
        fileURL: updateData.videoLink,
      });
    }

    /*
    =========================================
    AVAILABLE FLOORS
    =========================================
    */

    const availableFloors = req.body.availableFloors
      ? JSON.parse(req.body.availableFloors)
      : project.availableFloors;

    updateData.availableFloors =
      availableFloors;

    /*
    =========================================
    PROPERTIES
    =========================================
    */

    let properties = req.body.properties
      ? JSON.parse(req.body.properties)
      : project.properties;

    /*
    =========================================
    PROPERTY FILES
    field name example:
    propertyImages_0
    propertyDocs_0
    propertyVideos_0
    =========================================
    */

    if (req.files?.length > 0) {
      for (const file of req.files) {
        /*
        ==============================
        PROPERTY INDEX
        ==============================
        */

        const imageMatch =
          file.fieldname.match(
            /propertyImages_(\d+)/
          );

        const videoMatch =
          file.fieldname.match(
            /propertyVideos_(\d+)/
          );

        const docMatch =
          file.fieldname.match(
            /propertyDocs_(\d+)/
          );

        /*
        ==============================
        PROPERTY IMAGES
        ==============================
        */

        if (imageMatch) {
          const propertyIndex =
            imageMatch[1];

          if (
            !properties[propertyIndex]
              .imagesURLs
          ) {
            properties[propertyIndex]
              .imagesURLs = [];
          }

          const {
            imageURL: fileURL,
            imageID: fileID,
          } = await cloudinary.upload(
            file.path,
            "propertyFiles/images"
          );

          properties[propertyIndex].imagesURLs.push({
            fileURL,
            fileID,
          });
        }

        /*
        ==============================
        PROPERTY VIDEOS
        ==============================
        */

        else if (videoMatch) {
          const propertyIndex =
            videoMatch[1];

          if (
            !properties[propertyIndex]
              .videosURLs
          ) {
            properties[propertyIndex]
              .videosURLs = [];
          }

          const {
            imageURL: fileURL,
            imageID: fileID,
          } = await cloudinary.upload(
            file.path,
            "propertyFiles/videos"
          );

          properties[propertyIndex].videosURLs.push({
            fileURL,
            fileID,
          });
        }

        /*
        ==============================
        PROPERTY DOCS
        ==============================
        */

        else if (docMatch) {
          const propertyIndex =
            docMatch[1];

          if (
            !properties[propertyIndex]
              .docsURLs
          ) {
            properties[propertyIndex]
              .docsURLs = [];
          }

          const {
            imageURL: fileURL,
            imageID: fileID,
          } = await cloudinary.upload(
            file.path,
            "propertyFiles/docs",
            {
              resource_type: "raw",
            }
          );

          properties[propertyIndex].docsURLs.push({
            fileURL,
            fileID,
          });
        }
      }
    }

    updateData.properties = properties;

    /*
    =========================================
    UPDATE PROJECT
    =========================================
    */

    const updatedproject =
      await projectSchema.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );

    /*
    =========================================
    RESPONSE
    =========================================
    */

    res.status(200).json({
      message:
        "project updated successfully",
      updatedproject,
    });

    /*
    =========================================
    NOTIFICATIONS
    =========================================
    */

    // const admins = await userSchema.find({
    //   $or: [
    //     { type: "admin" },
    //     { role: 9 },
    //   ],
    // });

    // const notifications = admins.map(
    //   (admin) => ({
    //     user: admin._id,
    //     employee: req.token?.id,
    //     levels: "projects",
    //     type: "update",
    //     allowed: updatedproject?._id,
    //     message: "تم تعديل خدمة عامة",
    //   })
    // );

    // await notificationSchema.insertMany(
    //   notifications
    // );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Update project failed",
      error: error.message || error,
    });
  }
};

module.exports = updateProject;

