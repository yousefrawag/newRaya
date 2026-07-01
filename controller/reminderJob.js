const mongoose = require("mongoose");
const cron = require("node-cron");
const moment = require("moment");
const Client = require("../model/customerSchema");
const { SendWatssaoNotvcation } = require("../controller/compaign/CreateCompain");
const { generateReport } = require("../controller/ReportMatch/generateReport");

// ⏰ تذكير يومي (معلق حالياً)
// cron.schedule("15 2 * * *", async () => {
//   console.log("🚀 Running daily reminder job...");
//   // ... باقي الكود (تذكير العملاء) ...
// });

const initCronJobs = () => {
  console.log("⏰ جاري تهيئة المهام المجدولة...");
  console.log(`🕒 الوقت الحالي: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Riyadh' })}`);

  // ------------------------------------------
  // 1. التقرير الأسبوعي - كل يوم جمعة الساعة 8:00 صباحاً
  // ------------------------------------------
  cron.schedule("0 8 * * 5", async () => {
    console.log("📅 [التقرير الأسبوعي] بدء التنفيذ...");
    try {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      await generateReport("weekly", startDate, now);
      console.log("✅ [التقرير الأسبوعي] تم الإنشاء بنجاح");
    } catch (error) {
      console.error("❌ [التقرير الأسبوعي] فشل:", error.message);
    }
  });

  // ------------------------------------------
  // 2. التقرير الشهري - أول يوم في الشهر الساعة 8:00 صباحاً (تم توحيد التوقيت)
  // ------------------------------------------
  cron.schedule("0 8 1 * *", async () => {
    console.log("📅 [التقرير الشهري] بدء التنفيذ...");
    try {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      await generateReport("monthly", startDate, now);
      console.log("✅ [التقرير الشهري] تم الإنشاء بنجاح");
    } catch (error) {
      console.error("❌ [التقرير الشهري] فشل:", error.message);
    }
  });

  console.log("✅ تم تفعيل جميع المهام المجدولة بنجاح");
};

module.exports = { initCronJobs };