const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/ImportCustomers");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const DelateClient = async (req, res  , next) => {
  try {
    const { id } = req.params;
    await customerSchema.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer deleted successfully" });
       const admins = await userSchema.find({ type: "admin" });
                
                // ✅ Create notifications properly
                const notifications = admins.map((admin) => ({
                  user: admin._id,  // Ensure this is a number if required
                  employee: req.token?.id,
                  levels: "clients",
                  type: "delete",
                  allowed:"",
                  message: "تم  حذف بيانات عميل استراد وتصدير",
                }));
            
                // ✅ Save notifications
                await notificationSchema.insertMany(notifications);
  } catch (error) {
    next(error);
  }
};

module.exports = DelateClient;
