const DealyemployeeReports = require("../../model/DealyemployeeReports")
const GetAllReports = async (req, res, next) => {
  try {
    const data = await DealyemployeeReports
      .find({  })
      .populate("Customers")
      .populate("addedBy")

    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = GetAllReports;
