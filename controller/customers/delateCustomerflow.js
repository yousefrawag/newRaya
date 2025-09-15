const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sectionid, action, updates } = req.body;

    // Validate required parameters
    if (!id || !sectionid) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Find the customer
    const customer = await customerSchema.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let updatedCustomer;
    let notificationMessage;

    if (action === "update") {
      // Handle update operation
      const sectionIndex = customer.SectionFollow.findIndex(
        item => item._id.toString() === sectionid
      );

      if (sectionIndex === -1) {
        return res.status(404).json({ message: "Section not found" });
      }

      // Update the specific section
      customer.SectionFollow[sectionIndex] = {
        ...customer.SectionFollow[sectionIndex].toObject(),
        ...updates,
        updatedAt: new Date()
      };

      updatedCustomer = await customer.save();
      notificationMessage = "تم تحديث قسم من متابعة العميل";
    } else {
      // Handle delete operation (default)
      const updatedSections = customer.SectionFollow.filter(
        item => item._id.toString() !== sectionid
      );

      updatedCustomer = await customerSchema.findByIdAndUpdate(
        id,
        { $set: { SectionFollow: updatedSections } },
        { new: true }
      );
      notificationMessage = "تم حذف قسم من متابعة العميل";
    }

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Update failed" });
    }

    // Notify admins
  const admins = await userSchema.find({
  $or: [{ type: "admin" }, { role: 9 }]
});

    const notifications = admins.map(admin => ({
      user: admin._id,
      employee: req.token?.id,
      levels: "clients",
      type: "update",
      allowed: updatedCustomer._id,
      message: notificationMessage,
    }));

    await notificationSchema.insertMany(notifications);

    res.status(200).json({
      message: notificationMessage,
      updatedCustomer
    });

  } catch (error) {
    next(error);
  }
};

module.exports = updateCustomer;