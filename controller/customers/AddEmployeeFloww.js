const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const dealyReport = require("../../model/DealyemployeeReports")

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {notes} = req.body

    
    const CurrentLead = await customerSchema.findById(id)
    if(!CurrentLead){
        return res.status(200).json({mesg:"this customer not exict yet"})
    }

CurrentLead.moduleType = "customer"

    // Perform atomic update
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      CurrentLead,
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
      message: "تم  تحويل طلب الى عميل فعلى  ",
    }));

    await notificationSchema.insertMany(notifications);

  } catch (error) {
    next(error);
  }
};

module.exports = updateCustomer;
