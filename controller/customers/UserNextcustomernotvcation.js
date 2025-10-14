const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");

const UserNextcustomernotvcation = async (req, res, next) => {
  try {
    const founduser = await userSchema.findById(req.token.id).lean();
    if (!founduser) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // نجيب كل العملاء اللى عندهم تنبيه اليوم
    const reminders = await customerSchema.find({
      addBy: founduser.fullName.trim(),
      "SectionFollow.nextReminderDate": { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    // فلترة وتجميع البيانات بشكل بسيط للواجهة الأمامية
    const formattedReminders = reminders.flatMap(client => {
      return client.SectionFollow
        .filter(follow => 
          follow.nextReminderDate >= startOfDay && follow.nextReminderDate <= endOfDay
        )
        .map(follow => ({
        id:client?._id ,
          customerName: client.fullName,
          phoneNumber: client.phoneNumber,
          project: client.project,
          followDetails: follow.details || "بدون ملاحظات",
          contactDate: follow.detailsDate,
          nextReminderDate: follow.nextReminderDate,
          customerStatus: follow.CustomerDealsatuts || "غير محدد"
        }));
    });

    res.status(200).json({ 
      count: formattedReminders.length,
      data: formattedReminders 
    });

  } catch (error) {
    console.error("Error in UserNextcustomernotvcation:", error);
    next(error);
  }
};

module.exports = UserNextcustomernotvcation;
