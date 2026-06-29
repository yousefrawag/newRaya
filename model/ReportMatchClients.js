const mongoose = require("mongoose");

// Schema للعميل (مشترك بين المطابقين وغير المطابقين)
const reportCustomerSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
  customerName: String,
  score: Number, // 0 إذا كان غير مناسب
  
  // للعملاء المطابقين فقط
  matchedProperty: {
    projectId: mongoose.Schema.Types.ObjectId,
    projectName: String,
    floorType: String,
    floorTypeFlow: String,
    price: Number,
    downPayment: Number,
    monthlyInstallment: Number,
    governoate: String,
    city: String,
  },
  reasons: [
    {
      field: String,
      customerValue: String,
      propertyValue: String,
      score: Number,
      matchPercent: Number,
      matchedVia: String,
    },
  ],
  
  // حالة العميل
  status: {
    type: String,
    enum: ["matched", "unmatched"],
    default: "unmatched",
  },
  
  // أسباب عدم التطابق (موجزة)
  unmatchedReasons: [String],
  
  // ✅ حقول جديدة للعملاء غير المطابقين في الـ shortlist
  customerRequirements: [
    {
      rquireLocation: String,
      requireRegion: String,
      require: String,
      requireType: String,
    },
  ],
  closestMatch: {
    score: Number,
    property: {
      projectId: mongoose.Schema.Types.ObjectId,
      projectName: String,
      floorType: String,
      floorTypeFlow: String,
      price: Number,
      downPayment: Number,
      monthlyInstallment: Number,
      governoate: String,
      city: String,
    },
    reasons: [
      {
        field: String,
        customerValue: String,
        propertyValue: String,
        score: Number,
        matchPercent: Number,
        matchedVia: String,
      },
    ],
  },
});

// Schema الرئيسي للتقرير
const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    generatedAt: { type: Date, default: Date.now },
    summary: {
      totalCustomers: Number,
      matchedCount: Number,
      unmatchedCount: Number,
      avgScore: Number,
    },
    // العملاء المطابقين (جميعهم)
    matchedCustomers: [reportCustomerSchema],
    
    // ✅ العملاء غير المطابقين (القائمة المختصرة - قصيرة)
    shortlistUnmatched: [reportCustomerSchema], // تحتوي على أهم 20-50 عميل غير مطابق
    
    // (اختياري) إذا أردت الاحتفاظ بكل غير المطابقين للتحليل الداخلي، لكن لا تعرضهم في الـ Frontend
    // allUnmatched: [reportCustomerSchema], // نعلقها لتوفير المساحة
  },
  { timestamps: true }
);

module.exports = mongoose.model("reports", reportSchema);