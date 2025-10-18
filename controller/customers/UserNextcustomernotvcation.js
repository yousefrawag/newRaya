const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");

const UserNextcustomernotvcation = async (req, res, next) => {
  try {
    // 1️⃣ المستخدم الحالي
    const foundUser = await userSchema.findById(req.token.id).lean();
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const CurrentPermission = foundUser?.role === 9
    let filters 
    if(foundUser.type === "admin" || CurrentPermission) {
       filters = {"SectionFollow.nextReminderDate": { $exists: true }};
    }else{
      filters = {
        ...filters ,
              "SectionFollow.nextReminderDate": { $exists: true } ,
        addBy: {
          $regex: new RegExp(`(^|\\s|\\/)+${foundUser?.fullName.trim()}($|\\s|\\/)`, 'i') // Match name as part of a shared or individual value
        }
      };     
    }
    

    // 2️⃣ احسب تاريخ اليوم (محلي)
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // 3️⃣ هات كل العملاء اللى عندهم تذكيرات
    const customers = await customerSchema.find(filters
     ).lean();

    // 4️⃣ فلترة التذكيرات حسب اليوم الفعلي (اليوم/الشهر/السنة)
    const reminders = customers.flatMap(client =>
      (client.SectionFollow || [])
        .filter(follow => {
          if (!follow.nextReminderDate) return false;
          const d = new Date(follow.nextReminderDate);
          return (
            d.getDate() === todayDay &&
            d.getMonth() === todayMonth &&
            d.getFullYear() === todayYear
          );
        })
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

    // 5️⃣ رجّع النتيجة
    return res.status(200).json({
      count: reminders.length,
      data: reminders,
    });

  } catch (error) {
    console.error("Error in UserNextcustomernotvcation:", error);
    next(error);
  }
};

module.exports = UserNextcustomernotvcation;
