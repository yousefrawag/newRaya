const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    let customer = await customerSchema.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "This customer desn't exist" });
    }
  
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "customer updated successfully", updatedCustomer });
       const admins = await userSchema.find({ type: "admin" });
            
            // ✅ Create notifications properly
            const notifications = admins.map((admin) => ({
              user: admin._id,  // Ensure this is a number if required
              employee: req.token?.id,
              levels: "clients",
              type: "update",
              allowed:updatedCustomer?._id,
              message: "تم  تعديل بيانات العميل",
            }));
        
            // ✅ Save notifications
            await notificationSchema.insertMany(notifications);
  } catch (error) {
    next(error);
  }
};

module.exports = updateCustomer;
