const mongoose = require("mongoose");
const cron = require("node-cron");
const moment = require("moment");
const Client = require("../model/customerSchema"); // تعديل المسار حسب مشروعك
const axios = require("axios"); // لو هتبعت واتساب API
const {SendWatssaoNotvcation} = require("../controller/compaign/CreateCompain")
// ⏰ كل يوم الساعة 8 صباحًا
cron.schedule("0 8 * * *", async () => {
  console.log("🚀 Running daily reminder job...");

  const todayStart = moment().startOf("day").toDate();
  const todayEnd = moment().endOf("day").toDate();

  try {
    // 🧭 ابحث عن العملاء اللي عندهم تذكير النهارده
    const clients = await Client.find({
      ArchievStatuts: false,
      "SectionFollow.nextReminderDate": { $gte: todayStart, $lte: todayEnd },
    })
      .populate("SectionFollow.user", "fullName phoneNumber email")
      .lean();

    if (clients.length === 0) {
      console.log("📭 No reminders today.");
      return;
    }

    console.log(`📅 Found ${clients.length} clients with reminders today.`);

    // 🗂 تجميع العملاء لكل موظف
    const remindersByUser = {};

    for (const client of clients) {
      const todayReminders = client.SectionFollow.filter(f =>
        f.nextReminderDate &&
        moment(f.nextReminderDate).isBetween(todayStart, todayEnd, null, "[]")
      );

      for (const reminder of todayReminders) {
        const userId = reminder.user?._id?.toString() || reminder.user;
        if (!userId) continue;

        if (!remindersByUser[userId]) {
          remindersByUser[userId] = {
            user: reminder.user,
            clients: [],
          };
        }

        remindersByUser[userId].clients.push(client.fullName);
      }
    }

    // 💬 إرسال الرسالة لكل موظف
    for (const [userId, data] of Object.entries(remindersByUser)) {
      const { user, clients } = data;
const to = user.phoneNumber?.toString().trim().includes("+") ? user.phoneNumber.toString().trim() : `+${user.phoneNumber.toString().trim()}`

      const message = `
📢*منصه الرايه لخدمات التسويق والاستثمار* 📢

مرحبًا ${user.fullName} 👋

نفكّرك أن لديك اليوم ${clients.length} ${clients.length === 1 ? "عميل" : "عملاء"} للمتابعة.

📅 قائمة العملاء:
${clients.map((c, i) => `${i + 1}. ${c}`).join("\n")}

يرجى التواصل معهم بطريقة احترافية ومتابعتهم بشكل جيّد.
بالتوفيق 🌟
`;

      
      console.log(message);

      // ✅ مثال للإرسال الفعلي عبر UltraMsg API
      try {
    await SendWatssaoNotvcation(to ,  message)
        console.log(`✅ Message sent successfully to ${user.fullName}`);
      } catch (error) {
        console.error(`❌ Failed to send to ${user.fullName}:`, error.message);
      }
    }

    console.log("🎯 Daily reminder job completed.");
  } catch (error) {
    console.error("❌ Error running reminder job:", error);
  }
});
