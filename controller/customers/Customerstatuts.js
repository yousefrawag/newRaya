const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const dealyReport = require("../../model/DealyemployeeReports")

const CustomerStatuts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {status} = req.body

console.log(status);

    // Perform atomic update
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      {ArchievStatuts:status},
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
   const admins = await userSchema.find({
  $or: [{ type: "admin" }, { role: 9 }]
});

    const notifications = admins.map(admin => ({
      user: admin._id,
      employee: req.token?.id,
      levels: "clients",
      type: "update",
      allowed: updatedCustomer?._id,
      message: status ? "تم نقل العميل إالى الارشيف" :"تم إستعاده العميل من الارشيف ",
    }));

    await notificationSchema.insertMany(notifications);

  } catch (error) {
    next(error);
  }
};

module.exports = CustomerStatuts;
