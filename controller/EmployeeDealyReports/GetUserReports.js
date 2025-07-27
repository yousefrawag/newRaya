const DealyemployeeReports = require("../../model/DealyemployeeReports")
const GetUserReports = async (req, res, next) => {
  try {
    const data = await DealyemployeeReports
      .find({ addedBy: req.token.id })
      .populate("Customers")
      .populate("addedBy")

    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = GetUserReports;
