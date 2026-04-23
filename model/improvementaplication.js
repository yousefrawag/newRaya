const mongoose = require("mongoose");

const imporovementaplication = new mongoose.Schema(
  {
    // =========================
    // البيانات الاساسية
    // =========================
    basicInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      department: {
        type: String,
        required: true,
      },
      experienceYears: {
        type: Number,
        min: 0,
      },
      jobTitle: {
        type: String,
      },
      phone: {
        type: String,
      },
      platforms: [
        {
          type: String,
          enum: ["فيسبوك", "انستغرام", "تيكتوك", "سناب شات", "واتساب"],
        },
      ],
    },

    // =========================
    // الافكار العامة
    // =========================
    generalIdeas: {
      hasIdea: {
        type: String,
        enum: ["نعم", "لا"],
      },
      ideaDetails: String,
      ideaField: {
        type: String,
        enum: [
          "تسويق",
          "خدمه عملاء",
          "زياده مبيعات",
          "تطوير العمليات",
          "تقنيه",
        ],
      },
    },

    // =========================
    // تحليل الفكرة
    // =========================
    ideaAnalysis: {
      goal: {
        type: String,
        enum: [
          "زياده الارباح",
          "تقليل التكاليف",
          "تحسين العملاء",
          "تحسين تجربه العملاء",
          "تسريع العمل",
          "تعزيز جوده الخدمه",
        ],
      },
      executionMethod: String,
      requiredResources: [
        {
          type: String,
          enum: [
            "فريق عمل",
            "ميزانيه",
            "ادوات / برامج",
            "تدريب",
            "لاحتاج موارد",
          ],
        },
      ],
    },

    // =========================
    // تقييم الوضع الحالي
    // =========================
    currentEvaluation: {
      overallRating: {
        type: String,
        enum: ["ممتاز", "جيد", "متوسط", "ضعيف"],
      },
      mainProblems: [
        {
          type: String,
          enum: ["التسويق", "خدمه العملاء", "المتابعه", "الاداره"],
        },
      ],
    },

    // =========================
    // القسم التسويقي
    // =========================
    marketingSection: {
      hasMarketingIdea: {
        type: String,
        enum: ["نعم", "لا"],
      },
      marketingIdeaDetails: String,
      ideaType: {
        type: String,
        enum: [
          "جذب عملا جدد",
          "زياده التفاعل",
          "زياده المبيعات",
          "بناء براند قوى",
          "تحسين المحتوى",
        ],
      },
    },

    // =========================
    // تحليل الفكرة التسويقية
    // =========================
    marketingAnalysis: {
      goal: {
        type: String,
        enum: [
          "زياده الارباح",
          "انتشار اكبر",
          "تحسين صوره البراند",
          "زياده ثقه",
          "تحسين تجربه العميل",
        ],
      },
      executionSteps: String,
      tools: [
        {
          type: String,
          enum: [
            "اعلانات مموله",
            "تصوير ومونتاج",
            "فريق دعم",
            "افكار محتوى فقط",
            "لاتحتاج موارد",
          ],
        },
      ],
    },

    // =========================
    // تقييم التسويق الحالي
    // =========================
    marketingEvaluation: {
      rating: {
        type: String,
        enum: ["ممتاز", "جيد", "متوسط", "ضعيف"],
      },
      weaknesses: [
        {
          type: String,
          enum: [
            "ضعف التفاعل",
            "قله التواصل",
            "المحتوى غير جذاب",
            "استهداف غير دقيق",
            "بط الرد",
          ],
        },
      ],
    },

    // =========================
    // افكار تسويق اضافية
    // =========================
    extraMarketingIdeas: {
      customerAttraction: [
        {
          type: String,
          enum: [
            "اعلانات",
            "مسابقات",
            "محتوى فديو",
            "شراكات",
            "تطويرالسوشيال ميديا",
          ],
        },
      ],
      promotionIdeas: String,
      engagementIdeas: String,
    },

    // =========================
    // المحتوى والمنصات
    // =========================
    contentPlatforms: {
      mainPlatform: {
        type: String,
        enum: ["فيس بوك", "انستغرام", "سناب شات", "تيك توك", "واتساب"],
      },
      newContentIdea: String,
    },

    // =========================
    // الابداع
    // =========================
    creativity: {
      unlimitedBudgetIdea: String,
      crazyIdea: String,
    },

    // =========================
    // التحفيز
    // =========================
    motivation: {
      motivators: [
        {
          type: String,
          enum: [
            "حوافز ماليه",
            "تقدير وشكر",
            "حريه التنفيذ",
            "دعم الاداره",
            "تدريب وتطوير",
          ],
        },
      ],
      likesToImplement: {
        type: String,
        enum: ["نعم", "لاء"],
      },
    },
    applicationStatus: {
  type: String,
  enum: [
    "جديد",             // لسه متبعت ومحدش شافه
  
    "قيد التحليل",      // بيتحلل بجد (مهم جداً في حالتك)
    "يحتاج متابعة",     // محتاج تواصل أو clarification
       // تم التواصل مع صاحب الرد
    "مقبول",            // الفكرة اتوافقت
    "مرفوض",            // اترفضت
    "مؤجل"              // فكرة حلوة بس مش وقتها
  ],
  default: "جديد"
}
  },
  {
    timestamps: true,
  }
);

module.exports =  mongoose.model("imporovementaplication", imporovementaplication);