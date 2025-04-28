const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    
    const updateData = { ...req.body };
    console.log(req.body);
    
    // Remove SectionFollow from updateData to prevent overwrite
    delete updateData.SectionFollow;
    
    // Prepare the new SectionFollow entry
    const newSectionFollow = {
      details: req.body.SectionFollow.details,
      detailsDate: req.body.SectionFollow.detailsDate,
      user: req.token.id,
      CustomerDealsatuts: req.body.SectionFollow.CustomerDealsatuts,
      createdAt: new Date(),
    };

    // Single atomic update operation
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      {
        $set: updateData, // Update top-level fields
        $push: { SectionFollow: newSectionFollow } // Add to array
      },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "This customer doesn't exist" });
    }

    res.status(200).json({ 
      message: "Customer updated successfully", 
      updatedCustomer 
    });

    // Notify admins (same as before)
    const admins = await userSchema.find({ type: "admin" });
    const notifications = admins.map(admin => ({
      user: admin._id,
      employee: req.token?.id,
      levels: "clients",
      type: "update",
      allowed: updatedCustomer?._id,
      message: "تم تعديل بيانات العميل",
    }));

    await notificationSchema.insertMany(notifications);

  } catch (error) {
    next(error);
  }
};
module.exports = updateCustomer;