const projectSchema = require("../../model/projectSchema");
const cloudinary = require("../../middleware/cloudinary");

const EditProperty = async (req, res, next) => {
  try {
    const { id, propertyId } = req.params;
    console.log("Request params:", { id, propertyId });
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const CurrentProject = await projectSchema.findById(id);

    if (!CurrentProject) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    const propertyIndex = CurrentProject.properties.findIndex(
      item => item._id.toString() === propertyId
    );

    if (propertyIndex === -1) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    // البيانات الجديدة
    const updateData = req.body;

    // تحديث كل الحقول ما عدا imagesURLs
    Object.keys(updateData).forEach(key => {
      if (key !== "imagesURLs" && updateData[key] !== undefined && updateData[key] !== 'undefined') {
        // تعيين القيمة مباشرة للـ property
        CurrentProject.properties[propertyIndex][key] = updateData[key];
        console.log(`Updated ${key}:`, updateData[key]);
      }
    });

    // صور جديدة
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.mimetype && file.mimetype.startsWith("image/")) {
          try {
            const {
              imageURL: fileURL,
              imageID: fileID
            } = await cloudinary.upload(
              file.path,
              "projectFiles/property/images"
            );

            CurrentProject.properties[propertyIndex].imagesURLs.push({
              fileURL,
              fileID
            });
            
            console.log("Image uploaded successfully:", fileURL);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
          }
        }
      }
    }

    // حفظ التغييرات
    await CurrentProject.save();

    console.log("Property after update:", CurrentProject.properties[propertyIndex]);

    res.status(200).json({
      message: "Property updated successfully",
      property: CurrentProject.properties[propertyIndex]
    });

  } catch (error) {
    console.error("Error in EditProperty:", error);
    next(error);
  }
};

module.exports = EditProperty;