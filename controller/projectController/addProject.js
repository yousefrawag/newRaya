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

    console.log("\n========================================");
    console.log("🚀 ADD PROJECT STARTED");
    console.log("========================================");

    // =========================
    // DEBUG REQUEST
    // =========================

    console.log("📌 req.body keys:", Object.keys(req.body || {}));

    console.log("📌 req.files exists:", !!req.files);

    if (req.files) {
      console.log("📌 req.files type:", typeof req.files);
      console.log("📌 req.files isArray:", Array.isArray(req.files));
      console.log("📌 req.files keys:", Object.keys(req.files));

      console.log(
        "📌 req.files length:",
        Array.isArray(req.files)
          ? req.files.length
          : "NOT ARRAY"
      );
    }

    console.log("========================================\n");


    // =========================
    // PARSE PROPERTIES
    // =========================

    let properties = req.body.properties
      ? JSON.parse(req.body.properties)
      : [];

    console.log("📦 Properties:", properties);


    // =========================
    // CREATE PROJECT
    // =========================

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

      console.log("\n========================================");
      console.log("📂 START PROCESSING FILES");
      console.log("========================================");

      for (const index in req.files) {

        const file = req.files[index];

        console.log("\n----------------------------------------");
        console.log("📄 CURRENT FILE");
        console.log("----------------------------------------");

        console.log({
          index,
          fieldname: file?.fieldname,
          originalname: file?.originalname,
          mimetype: file?.mimetype,
          size: file?.size,
          path: file?.path,
        });


        // =========================
        // CHECK FILE OBJECT
        // =========================

        if (!file || !file.fieldname) {

          console.log("❌ INVALID FILE OBJECT");
          console.log(file);

          continue;
        }


        // =========================================
        // PROPERTY FILES
        // =========================================

        if (file.fieldname.startsWith("property")) {

          console.log("🏠 This is a PROPERTY file");

          const propertyIndex = Number(
            file.fieldname.split("_")[1]
          );

          console.log("📌 Property index:", propertyIndex);

          if (
            propertyIndex !== undefined &&
            properties[propertyIndex]
          ) {

            console.log(
              "✅ Property exists:",
              propertyIndex
            );


            // =========================
            // IMAGE
            // =========================

            if (
              file.mimetype === "image/png" ||
              file.mimetype === "image/jpeg" ||
              file.mimetype === "image/jpg"
            ) {

              console.log("🖼️ PROPERTY IMAGE DETECTED");

              try {

                console.log(
                  "☁️ Uploading property image to Cloudinary..."
                );

                const {
                  imageURL: fileURL,
                  imageID: fileID,
                } = await cloudinary.upload(
                  file.path,
                  "projectFiles/property/images"
                );

                console.log(
                  "✅ Property image uploaded:",
                  {
                    fileURL,
                    fileID,
                  }
                );

                properties[propertyIndex]
                  .imagesURLs
                  .push({
                    fileURL,
                    fileID,
                  });

              } catch (uploadError) {

                console.log(
                  "❌ PROPERTY IMAGE CLOUDINARY ERROR:",
                  uploadError
                );

                throw uploadError;
              }

            }


            // =========================
            // VIDEO
            // =========================

            else if (
              file.mimetype &&
              file.mimetype.startsWith("video/")
            ) {

              console.log("🎥 PROPERTY VIDEO DETECTED");

              console.log("🎥 Video mimetype:", file.mimetype);

              console.log(
                "☁️ Uploading property video to Cloudinary..."
              );

              try {

                const {
                  imageURL: fileURL,
                  imageID: fileID,
                } = await cloudinary.upload(
                  file.path,
                  "projectFiles/property/videos"
                );

                console.log(
                  "✅ PROPERTY VIDEO UPLOADED:",
                  {
                    fileURL,
                    fileID,
                  }
                );

                properties[propertyIndex]
                  .videosURLs
                  .push({
                    fileURL,
                    fileID,
                  });

              } catch (uploadError) {

                console.log(
                  "❌ PROPERTY VIDEO CLOUDINARY ERROR:"
                );

                console.log(uploadError);

                throw uploadError;
              }

            }


            // =========================
            // DOCS
            // =========================

            else if (
              allowedTypes.includes(
                file.mimetype
              )
            ) {

              console.log("📄 PROPERTY DOCUMENT DETECTED");

              try {

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

                console.log(
                  "✅ Property document uploaded:",
                  {
                    fileURL,
                    fileID,
                  }
                );

                properties[propertyIndex]
                  .docsURLs
                  .push({
                    fileURL,
                    fileID,
                  });

              } catch (uploadError) {

                console.log(
                  "❌ PROPERTY DOCUMENT CLOUDINARY ERROR:",
                  uploadError
                );

                throw uploadError;
              }

            }


            // =========================
            // UNKNOWN TYPE
            // =========================

            else {

              console.log(
                "⚠️ PROPERTY FILE TYPE NOT SUPPORTED"
              );

              console.log({
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
              });

            }

          } else {

            console.log(
              "❌ PROPERTY INDEX DOES NOT EXIST"
            );

            console.log({
              propertyIndex,
              propertiesLength: properties.length,
              fieldname: file.fieldname,
            });

          }

        }


        // =========================================
        // PROJECT FILES
        // =========================================

        else {

          console.log("🏗️ This is a PROJECT file");


          // =========================
          // IMAGE
          // =========================

          if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
          ) {

            console.log("🖼️ PROJECT IMAGE DETECTED");

            try {

              console.log(
                "☁️ Uploading project image to Cloudinary..."
              );

              const {
                imageURL: fileURL,
                imageID: fileID,
              } = await cloudinary.upload(
                file.path,
                "projectFiles/images"
              );

              console.log(
                "✅ PROJECT IMAGE UPLOADED:",
                {
                  fileURL,
                  fileID,
                }
              );

              imagesURLs.push({
                fileURL,
                fileID,
              });

            } catch (uploadError) {

              console.log(
                "❌ PROJECT IMAGE CLOUDINARY ERROR:",
                uploadError
              );

              throw uploadError;
            }

          }


          // =========================
          // VIDEO
          // =========================

          else if (
            file.mimetype &&
            file.mimetype.startsWith("video/")
          ) {

            console.log("🎥 PROJECT VIDEO DETECTED");

            console.log(
              "🎥 Video mimetype:",
              file.mimetype
            );

            console.log(
              "🎥 Video original name:",
              file.originalname
            );

            console.log(
              "🎥 Video size:",
              file.size
            );

            console.log(
              "🎥 Video path:",
              file.path
            );


            try {

              console.log(
                "☁️ START CLOUDINARY VIDEO UPLOAD..."
              );

              const {
                imageURL: fileURL,
                imageID: fileID,
              } = await cloudinary.upload(
                file.path,
                "projectFiles/videos"
              );

              console.log(
                "✅ PROJECT VIDEO UPLOADED SUCCESSFULLY"
              );

              console.log({
                fileURL,
                fileID,
              });

              videosURLs.push({
                fileURL,
                fileID,
              });

            } catch (uploadError) {

              console.log(
                "\n❌❌❌ PROJECT VIDEO CLOUDINARY ERROR ❌❌❌"
              );

              console.log(uploadError);

              console.log(
                "========================================"
              );

              throw uploadError;
            }

          }


          // =========================
          // DOCS
          // =========================

          else if (
            allowedTypes.includes(
              file.mimetype
            )
          ) {

            console.log("📄 PROJECT DOCUMENT DETECTED");

            try {

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

              console.log(
                "✅ PROJECT DOCUMENT UPLOADED:",
                {
                  fileURL,
                  fileID,
                }
              );

              docsURLs.push({
                fileURL,
                fileID,
              });

            } catch (uploadError) {

              console.log(
                "❌ PROJECT DOCUMENT CLOUDINARY ERROR:",
                uploadError
              );

              throw uploadError;
            }

          }


          // =========================
          // UNKNOWN TYPE
          // =========================

          else {

            console.log(
              "⚠️ PROJECT FILE TYPE NOT SUPPORTED"
            );

            console.log({
              fieldname: file.fieldname,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            });

          }

        }

      }

      console.log("\n========================================");
      console.log("📂 FINISHED PROCESSING FILES");
      console.log("========================================");

      console.log("🖼️ Images:", imagesURLs);
      console.log("🎥 Videos:", videosURLs);
      console.log("📄 Docs:", docsURLs);

    } else {

      console.log("⚠️ NO req.files RECEIVED");

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

    const user = await userSchema.findById(
      req.token.id
    );

    if (user?.type === "InstitutionsUser") {

      project.projectReviewStatus = "underReview";
      project.InstitutionsCompany = user?.institution;
      project.sourceType = "Institutions";

    }


    // =========================
    // IMAGE LINK
    // =========================

    if (project.imageLink) {

      console.log(
        "🔗 Adding imageLink:"
      );

      console.log(project.imageLink);

      project.imagesURLs.push({
        fileID: new Date(),
        fileURL: project.imageLink,
      });

    }


    // =========================
    // VIDEO LINK
    // =========================

    if (project.videoLink) {

      console.log(
        "🔗 Adding videoLink:"
      );

      console.log(project.videoLink);

      project.videosURLs.push({
        fileID: new Date(),
        fileURL: project.videoLink,
      });

    }


    // =========================
    // BEFORE SAVE DEBUG
    // =========================

    console.log("\n========================================");
    console.log("💾 BEFORE PROJECT SAVE");
    console.log("========================================");

    console.log("Images count:", project.imagesURLs.length);
    console.log("Videos count:", project.videosURLs.length);
    console.log("Docs count:", project.docsURLs.length);

    console.log("Images:", project.imagesURLs);
    console.log("Videos:", project.videosURLs);
    console.log("Docs:", project.docsURLs);

    console.log("Property files:");

    project.properties.forEach((property, index) => {

      console.log(`Property ${index}:`, {
        images: property.imagesURLs?.length || 0,
        videos: property.videosURLs?.length || 0,
        docs: property.docsURLs?.length || 0,
      });

    });


    // =========================
    // SAVE
    // =========================

    await project.save();


    console.log("\n========================================");
    console.log("✅ PROJECT SAVED SUCCESSFULLY");
    console.log("========================================");

    console.log("Project ID:", project._id);
    console.log("Final videos:", project.videosURLs);


    res.status(200).json({
      project,
    });


    // =========================
    // NOTIFICATIONS
    // =========================

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
    //     type: "add",
    //     allowed: project?._id,
    //     message:
    //       "تم إضافة مشروع جديد",
    //   })
    // );

    // await notificationSchema.insertMany(
    //   notifications
    // );


  } catch (error) {

    console.log("\n========================================");
    console.log("❌❌❌ ADD PROJECT ERROR ❌❌❌");
    console.log("========================================");

    console.error(error);

    console.log("Message:", error?.message);
    console.log("Stack:", error?.stack);

    console.log("========================================\n");

    res.status(500).json({
      message: "Add project failed",
      error: error.message || error,
    });

  }

};

module.exports = addProject;