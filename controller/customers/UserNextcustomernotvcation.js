const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");

const UserNextcustomernotvcation = async (req, res, next) => {
  try {
    const founduser = await userSchema.findById(req.token.id).lean();
    if (!founduser) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

    console.log({ startOfDay, endOfDay });

    const reminders = await customerSchema.find({
      addBy: founduser.fullName.trim(),
      "SectionFollow.nextReminderDate": { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    console.log("Reminders found:", reminders.length);

    const formattedReminders = reminders.flatMap(client =>
      (client.SectionFollow || [])
        .filter(follow =>
          follow.nextReminderDate &&
          new Date(follow.nextReminderDate) >= startOfDay &&
          new Date(follow.nextReminderDate) <= endOfDay
        )
        .map(follow => ({
          id: client._id,
          customerName: client.fullName,
          phoneNumber: client.phoneNumber,
          project: client.project,
          followDetails: follow.details || "بدون ملاحظات",
          contactDate: follow.detailsDate,
          nextReminderDate: follow.nextReminderDate,
          customerStatus: follow.CustomerDealsatuts || "غير محدد",
        }))
    );

    res.status(200).json({
      count: formattedReminders.length,
      data: formattedReminders,
    });
  } catch (error) {
    console.error("Error in UserNextcustomernotvcation:", error);
    next(error);
  }
};


module.exports = UserNextcustomernotvcation;
