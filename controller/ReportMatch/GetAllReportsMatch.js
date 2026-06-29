// controllers/reportController.js

const Report = require("../../model/ReportMatchClients");

/**
 * جلب جميع التقارير (مرتبة تنازلياً حسب التاريخ)
 */
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 }) // الأحدث أولاً
      .select("-matchedCustomers -unmatchedCustomers"); // إخفاء التفاصيل الكبيرة لتخفيف الحجم

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("❌ خطأ في جلب التقارير:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب التقارير",
      error: error.message,
    });
  }
};

/**
 * جلب تقرير واحد بالمعرف (مع كل التفاصيل)
 */
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    // التحقق من صحة المعرف
    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "معرف التقرير غير صحيح",
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "التقرير غير موجود",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("❌ خطأ في جلب التقرير:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب التقرير",
      error: error.message,
    });
  }
};

/**
 * حذف تقرير بالمعرف
 */
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // التحقق من صحة المعرف
    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "معرف التقرير غير صحيح",
      });
    }

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "التقرير غير موجود",
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم حذف التقرير بنجاح",
    });
  } catch (error) {
    console.error("❌ خطأ في حذف التقرير:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء حذف التقرير",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  deleteReport,
};