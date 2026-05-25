
const projectSchema = require("../../model/projectSchema");
const cloudinary = require("../../middleware/cloudinary");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");

const addProject = async (req, res, next) => {

  const allowedTypes = [
    "application/pdf",
    "application/zip",
    "application/x-rar-compressed",
    "application/msword",
    "application/octet-stream",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  try {

    // =========================
    // PARSE PROPERTIES
    // =========================
    let properties = req.body.properties
      ? JSON.parse(req.body.properties)
      : [];

    const project = new projectSchema(req.body);

    project.addedBy = req.token.id;

    // =========================
    // PROJECT FILES
    // =========================
    const imagesURLs = [];
    const videosURLs = [];
    const docsURLs = [];

    // =========================
    // INIT PROPERTY FILES
    // =========================
    properties = properties.map((item) => ({
      ...item,
      imagesURLs: [],
      videosURLs: [],
      docsURLs: [],
    }));

    // =========================
    // HANDLE FILES
    // =========================
    if (req.files) {

      for (const index in req.files) {

        const file = req.files[index];

        // =========================================
        // PROPERTY FILES
        // name example:
        // propertyImages_0
        // propertyDocs_0
        // propertyVideos_0
        // =========================================

        if (file.fieldname.startsWith("property")) {

          const propertyIndex = Number(
            file.fieldname.split("_")[1]
          );

          if (
            propertyIndex !== undefined &&
            properties[propertyIndex]
          ) {

            // IMAGE
            if (
              file.mimetype === "image/png" ||
              file.mimetype === "image/jpeg" ||
              file.mimetype === "image/jpg"
            ) {

              const {
                imageURL: fileURL,
                imageID: fileID,
              } = await cloudinary.upload(
                file.path,
                "projectFiles/property/images"
              );

              properties[propertyIndex]
                .imagesURLs
                .push({
                  fileURL,
                  fileID,
                });

            }

            // VIDEO
            else if (
              file.mimetype === "video/mp4"
            ) {

              const {
                imageURL: fileURL,
                imageID: fileID,
              } = await cloudinary.upload(
                file.path,
                "projectFiles/property/videos"
              );

              properties[propertyIndex]
                .videosURLs
                .push({
                  fileURL,
                  fileID,
                });

            }

            // DOCS
            else if (
              allowedTypes.includes(
                file.mimetype
              )
            ) {

              const {
                imageURL: fileURL,
                imageID: fileID,
              } = await cloudinary.upload(
                file.path,
                "projectFiles/property/docs",
                {
                  resource_type: "raw",
                }
              );

              properties[propertyIndex]
                .docsURLs
                .push({
                  fileURL,
                  fileID,
                });

            }

          }

        }

        // =========================================
        // PROJECT FILES
        // =========================================
        else {

          // IMAGE
          if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
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

          // VIDEO
          else if (
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

          // DOCS
          else if (
            allowedTypes.includes(
              file.mimetype
            )
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

    }

    // =========================
    // SAVE PROJECT FILES
    // =========================
    project.imagesURLs = imagesURLs;
    project.videosURLs = videosURLs;
    project.docsURLs = docsURLs;

    // =========================
    // SAVE PROPERTY FILES
    // =========================
    project.properties = properties;

    // =========================
    // LINKS
    // =========================
    if (project.imageLink) {

      project.imagesURLs.push({
        fileID: new Date(),
        fileURL: project.imageLink,
      });

    }

    if (project.videoLink) {

      project.videosURLs.push({
        fileID: new Date(),
        fileURL: project.videoLink,
      });

    }

    // =========================
    // SAVE
    // =========================
    await project.save();

    res.status(200).json({
      project,
    });

    // =========================
    // NOTIFICATIONS
    // =========================
    const admins = await userSchema.find({
      $or: [
        { type: "admin" },
        { role: 9 },
      ],
    });

    const notifications = admins.map(
      (admin) => ({
        user: admin._id,
        employee: req.token?.id,
        levels: "projects",
        type: "add",
        allowed: project?._id,
        message:
          "تم إضافة مشروع جديد",
      })
    );

    await notificationSchema.insertMany(
      notifications
    );

  } catch (error) {

    res.status(500).json({
      message: "Add project failed",
      error: error.message || error,
    });

  }

};

module.exports = addProject;

