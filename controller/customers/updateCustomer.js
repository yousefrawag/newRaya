const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);

    const updateData = { ...req.body };
    
    // Remove SectionFollow from updateData to prevent overwrite
    delete updateData.SectionFollow;

    const updateOperation = {
      $set: updateData
    };

    // If SectionFollow is provided, prepare and add it
    if (req.body.SectionFollow) {
      const newSectionFollow = {
        details: req.body.SectionFollow.details,
        detailsDate: req.body.SectionFollow.detailsDate,
        user: req.token.id,
        CustomerDealsatuts: req.body.SectionFollow.CustomerDealsatuts,
        createdAt: new Date(),
      };
      updateOperation.$push = { SectionFollow: newSectionFollow };
    }

    // Perform atomic update
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "This customer doesn't exist" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      updatedCustomer
    });

    // Notify admins
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
