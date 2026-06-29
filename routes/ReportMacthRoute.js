// routes/reportRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllReports,
  getReportById,
  deleteReport,
} = require("../controller/ReportMatch/GetAllReportsMatch");

// GET /api/reports - جلب جميع التقارير
router.get("/", getAllReports);

// GET /api/reports/:id - جلب تقرير محدد
router.get("/:id", getReportById);

// DELETE /api/reports/:id - حذف تقرير
router.delete("/:id", deleteReport);

module.exports = router;