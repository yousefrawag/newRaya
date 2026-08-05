const projectSchema = require("../../model/projectSchema");

const GetArchievData = async (req, res, next) => {
  try {
    // ✅ جلب المشاريع التي حالتها "archiev" أو "underReview"
    const data = await projectSchema
      .find({
        $or: [
          { status: "archiev" },
          { projectReviewStatus: "underReview" }
        ]
      })
      .populate("addedBy")
      .sort({ createdAt: -1 });

    // لا حاجة للـ filter لأن الاستعلام بالفعل يقوم بالتصفية
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = GetArchievData;