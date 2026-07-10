const mongoose = require("mongoose");

// Schema للعميل الأساسي (مشترك)
const reportCustomerSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
  customerName: String,
  score: Number,
  
  
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
  
  status: {
    type: String,
    enum: ["matched", "unmatched"],
    default: "unmatched",
  },
  
  unmatchedReasons: [String],
  
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

// ✅ Schema للعميل في التحليلات (مع بيانات الدفعة والقسط)
const analyticsCustomerSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
  customerName: String,
  firstPayment: Number, // ✅ الدفعة الأولى للعميل
  monthlyInstallment: Number, // ✅ القسط الشهري للعميل
  clientRequirements:[] ,
  phoneNumber:String

});

// ✅ Schema للتحليلات المعدل
const analyticsSchema = new mongoose.Schema({
  byPropertyType: [
    {
      name: String,
      count: Number,
      customers: [analyticsCustomerSchema],
      subTypes: [
        {
          name: String,
          count: Number,
          customers: [analyticsCustomerSchema],
        },
      ],
    },
  ],
  
  byLocation: [
    {
      name: String,
      count: Number,
      customers: [analyticsCustomerSchema],
      regions: [
        {
          name: String,
          count: Number,
          customers: [analyticsCustomerSchema],
        },
      ],
    },
  ],
  
  byFinancialAbility: [
    {
      range: String,
      min: Number,
      max: Number,
      count: Number,
      customers: [analyticsCustomerSchema],
    },
  ],
  
  byStatus: {
    matched: {
      count: Number,
      customers: [analyticsCustomerSchema],
    },
    unmatched: {
      count: Number,
      customers: [analyticsCustomerSchema],
    },
  },
  
  byRequireType: [
    {
      name: String,
      count: Number,
      customers: [analyticsCustomerSchema],
    },
  ],

  crossTabulation: [
    {
      require: String,
      requireType: String,
      location: String,
      region: String,
      paymentRange: String,
      count: Number,
      customers: [analyticsCustomerSchema],
    },
  ],
});

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["weekly", "monthly"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    generatedAt: { type: Date, default: Date.now },
    summary: {
      totalCustomers: Number,
      matchedCount: Number,
      unmatchedCount: Number,
      avgScore: Number,
    },
    matchedCustomers: [reportCustomerSchema],
    shortlistUnmatched: [reportCustomerSchema],
    analytics: analyticsSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("reports", reportSchema);