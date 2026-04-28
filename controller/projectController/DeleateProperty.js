const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const DeleateProperty = async (req, res, next) => {
  const { id, proertyId } = req.params;

  try {
    const project = await projectSchema.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project doesn't exist" });
    }

    // ✅ حذف الشقة من array
    await projectSchema.findByIdAndUpdate(
      id,
      {
        $pull: {
          properties: { _id: proertyId },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Property deleted successfully" });

    // 👇 notifications
    const admins = await userSchema.find({
      $or: [{ type: "admin" }, { role: 9 }],
    });

    const notifications = admins.map((admin) => ({
      user: admin._id,
      employee: req.token?.id,
      levels: "projects",
      type: "delete",
      allowed: id,
      message: "تم حذف شقة",
    }));

    await notificationSchema.insertMany(notifications);

  } catch (error) {
    next(error);
  }
};
module.exports = DeleateProperty;
