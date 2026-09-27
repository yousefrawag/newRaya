const customerSchema = require("../../model/ImportCustomers");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const dealyReport = require("../../model/DealyemployeeReports")
const dealyReportBroker = require("../../model/brokerDeailyReports")

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes, SectionFollow } = req.body;

    console.log("req.body =>", req.body);

    const CurrentUser = await userSchema.findById(req.token.id);

    // ===== 1) بيانات العميل بدون SectionFollow =====
    const updateData = { ...req.body };
    delete updateData.SectionFollow;

    // ===== 2) بناء عملية الـ update =====
    const updateOperation = {
      $set: updateData,
    };

    // ===== 3) لو جاي متابعة جديدة → $push في الـ array =====
    if (SectionFollow && Object.keys(SectionFollow).length > 0) {
      updateOperation.$push = {
        SectionFollow: {
          ...SectionFollow,
          user: CurrentUser?._id || req.token?.id,  // ⚠️ اسم الحقل user مش addedBy
          createdAt: new Date(),
        },
      };
    }

    // ===== 4) تنفيذ التحديث =====
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "This customer doesn't exist" });
    }

    // ===== 5) الرد =====
    res.status(200).json({
      message: "Customer updated successfully",
      updatedCustomer,
    });

    // ===== 6) الإشعارات =====
    const admins = await userSchema.find({
      $or: [{ type: "admin" }, { role: 9 }],
    });

    const notifications = admins.map((admin) => ({
      user: admin._id,
      employee: req.token?.id,
      levels: "importclients",
      type: "update",
      allowed: updatedCustomer?._id,
      message: "تم تعديل بيانات عميل استيراد وتصدير",
    }));

    if (notifications.length) {
      await notificationSchema.insertMany(notifications);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = updateCustomer;

