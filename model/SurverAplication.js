const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  // 1. البيانات الأساسية
  name: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  age: { type: Number, required: true },
  workHours: { type: Number },
  currentlyWorking: { type: String, enum: ['نعم', 'لا'] },
  marketingExperience: { type: String, enum: ['نعم', 'لا'] },

  // 2. الخبرة العملية
  experienceYears: { 
    type: String, 
    enum: ['أقل من سنة', '1–2 سنة', 'أكثر من 3 سنوات'] 
  },
  previousProjects: { type: String, enum: ['نعم', 'لا'] },
  projectTypes: { type: String },
  achievedResults: { type: String, enum: ['نعم', 'لا'] },

  // 3. المنصات
  platforms: { 
    type: [String], 
    required: true,
    enum: ['فيسبوك', 'إنستجرام', 'تيك توك', 'سناب شات', 'X (تويتر)', 'يوتيوب', 'لينكد إن']
  },

  // 4. الأداء والنتائج
  strongestPlatform: { type: String },
  resultTypes: { 
    type: [String], 
    enum: ['تفاعل', 'متابعين', 'مبيعات', 'رسائل', 'انتشار'] 
  },
  resultExample: { type: String },

  // 5. المهارات الأساسية
  bestSkills: { 
    type: [String], 
    enum: ['نشر المحتوى', 'إعلانات ممولة', 'فيديوهات', 'كتابة محتوى', 'تصميم'] 
  },
  contentType: { 
    type: [String], 
    enum: ['فيديو', 'صوت', 'صور وتصاميم', 'مزيج'] 
  },
  skillLevel: { 
    type: String, 
    enum: ['مبتدئة', 'متوسطة', 'محترفة'] 
  },

  // 6. الأدوات
  tools: { 
    type: [String], 
    enum: ['Canva', 'CapCut', 'Meta Ads Manager', 'TikTok Ads', 'أدوات تحليل'] 
  },
  otherTools: { type: String },

  // 7. تحليل البيانات
  analyticsExperience: { type: String, enum: ['نعم', 'لا'] },
  trackingMetrics: { 
    type: [String], 
    enum: ['مشاهدات', 'تفاعل', 'نقرات', 'رسائل', 'مبيعات'] 
  },
  dataExtraction: { type: String, enum: ['نعم', 'إلى حد ما', 'لا'] },
  dataSources: { 
    type: [String], 
    enum: ['Insights', 'Ads Manager', 'تقارير', 'أدوات خارجية'] 
  },
  analysisAction: { 
    type: [String], 
    enum: ['أعدل الحملة', 'أطور المحتوى', 'أوقف الإعلان', 'أستمر'] 
  },
  targetAudience: { type: String, enum: ['نعم', 'إلى حد ما', 'لا'] },
  audienceSelection: { 
    type: [String], 
    enum: ['العمر والموقع', 'الاهتمامات', 'السلوك', 'بيانات سابقة', 'تحليل المنافسين'] 
  },
  idealClient: { type: String, enum: ['نعم', 'لا'] },
  clientSelectionMethod: { type: String },

  // 8. التخصص الأساسي
  mainSpecialization: { 
    type: String, 
    required: true,
    enum: ['إدارة الإعلانات', 'صناعة المحتوى', 'كتابة المحتوى', 'التصميم'] 
  },

  // الباقي بنفس النمط
  whySpecialization: { type: String, required: true },
  howYouWork: { type: String },
  personalResults: { type: String },
  workPreference: { type: String, enum: ['فردي', 'فريق'] },
  punctuality: { type: String, enum: ['عالي', 'متوسط', 'ضعيف'] },
  pressureTolerance: { type: String, enum: ['عالي', 'متوسط', 'ضعيف'] },
  goal: { type: String, required: true },
  willingToLearn: { type: String, enum: ['نعم', 'لا'], required: true },
  applicationStatus: { 
    type: String, 
    enum: ['جديد', 'قيد المراجعة', 'تم التواصل', 'مرفوض'], 
    default: 'جديد' 
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);