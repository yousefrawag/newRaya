const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  // --- 1. معلومات شخصية ---
  personalInfo: {
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    birthDate: { type: Date, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    maritalStatus: { 
      type: String, 
      enum: ['أعزب / عزباء', 'متزوج / متزوجة', 'مطلق / مطلقة', 'أرمل / أرملة'],
      required: true 
    } // Select field
  },

  // --- 2. بيانات الوظيفة ---
  jobDetails: {
    appliedPosition: { type: String, required: true }, // الوظيفة المقدم لها
    referralSource: { 
      type: String, 
      enum: ['إعلان', 'وسائل تواصل', 'صديق', 'أخرى'] 
    }, // كيف سمعت عنا - Select field
    employmentType: { 
      type: String, 
      enum: ['دوام كامل', 'دوام جزئي', 'عمل عن بعد'],
      required: true 
    } // نوع العمل - Select field
  },

  // --- 3. المؤهلات العلمية ---
  education: {
    lastDegree: { type: String, required: true }, // آخر شهادة علمية
    specialization: { type: String, required: true },
    institution: { type: String, required: true },
    courses: [String] // Array of strings لسهولة البحث في الدورات
  },

  // --- 4. الخبرات العملية (الفلترة الذكية) ---
  experience: {
    hasRealEstateExp: { type: Boolean, default: false }, // نعم/لا
    hasCustomerFollowUpExp: { type: Boolean, default: false }, // نعم/لا
    hasCrmExp: { type: Boolean, default: false }, // نعم/لا
    
    // مهارات تقنية (Multi-select)
    technicalSkills: [{
      type: String,
      enum: ['Microsoft Office', 'إدارة الإعلانات', 'التصميم (Photoshop/Illustrator)', 'كتابة المحتوى', 'تحليل البيانات']
    }],
    
    // مهارات شخصية (Multi-select)
    softSkills: [{
      type: String,
      enum: ['العمل ضمن فريق', 'إدارة الوقت', 'تحمل ضغط العمل', 'التواصل الفعال']
    }]
  },

  // --- 5. الحاسوب والذكاء الاصطناعي ---
  techAndAI: {
    ownsLaptop: { type: Boolean, required: true }, // نعم/لا
    knowsAIDataAnalysis: { type: Boolean, default: false } // نعم/لا
  },

  // --- 6. التقييم العملي (أسئلة مقالية للفرز اليدوي) ---
  practicalEvaluation: {
    pressureHandling: { type: String },
    difficultSituation: { type: String },
    thirtyDaysPlan: { type: String },
    uniqueValue: { type: String }
  },

  // --- 7. الجاهزية للعمل ---
  readiness: {
    isCurrentlyEmployed: { type: Boolean, default: false }, // نعم/لا
    otherCommitments: { type: String }, // نص
    acceptsTargets: { type: Boolean, required: true } // نعم/لا (مهم جداً للفلترة)
  },

  // بيانات إضافية للنظام
  createdAt: { type: Date, default: Date.now },
  applicationStatus: { 
    type: String, 
    enum: ['جديد', 'قيد المراجعة', 'تم التواصل', 'مرفوض'], 
    default: 'جديد' 
  }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);