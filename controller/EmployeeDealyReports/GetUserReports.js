const DealyemployeeReports = require("../../model/DealyemployeeReports")
const GetUserReports = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
       const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    // 🔍 الفلترة الأساسية (مثل البحث أو غيره)
    const filter = {
      addedBy: req.token.id,
      ...dateFilter,
    };
    const data = await DealyemployeeReports
      .find(filter)
      .populate("Customers")
      .populate("addedBy")

    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = GetUserReports;
