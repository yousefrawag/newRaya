const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema")
const getallProjects = async (req, res, next) => {

  
  try {
  const id = req.token.id
    const user = await userSchema.findById(id)
        const userId = req.token.id;
let filter ;
   const isAdmin = user.role === 9 || user.type === "admin";
    const isEmployee = user.type === "employee";
    const isInstitutionsUser = user.type === "InstitutionsUser";
    const reviewCondition = {
      $or: [
        { projectReviewStatus: "reviewed" },
        { projectReviewStatus: { $exists: false } },
        { projectReviewStatus: null }
      ]
    };
    if (isAdmin || isEmployee) {
      // ✅ الأدمن والموظف يشاهدون كل المشاريع
      filter = reviewCondition;
    } 
    else if (isInstitutionsUser) {
      // ✅ مستخدم مؤسسة: يشاهد فقط المشاريع المسموح بها + التي أضافها
      const allowedProjectIds = user.allowedProjects || [];
      const myProjects = { addedBy: userId };

      // بناء شرط $or: إما في allowedProjects أو من إضافته
      const orConditions = [];

      if (allowedProjectIds.length > 0) {
        orConditions.push({ _id: { $in: allowedProjectIds } });
      }

      // إضافة شرط المشاريع التي أضافها (دائماً، حتى لو كانت فارغة)
      orConditions.push(myProjects);

      // إذا كان لديه على الأقل شرط واحد صالح، نضيفه للفلتر
      if (orConditions.length > 0) {
filter = {
  $and: [
    { $or: orConditions },
    reviewCondition
  ]
};
      } else {
        // لا توجد شروط → لا يرى أي مشروع
        filter = { _id: { $in: [] } }; // شرط مستحيل التحقق
      }
    } 
    else {
      // أي نوع مستخدم آخر → لا يرى شيئاً
      filter = { _id: { $in: [] } };
    }



    const data = await projectSchema.find(filter).populate("addedBy").populate("InstitutionsCompany").sort({ createdAt: -1 });
    const filtered = data.filter(item => item.status?.trim() === 'process');
    const projectStatusCount = data.reduce((acc, item) => {
      const status = item.projectStatus; // Extract project status
    
      if (!acc[status]) {
        acc[status] = { status: status, count: 0 }; // Initialize if not exists
      }
    
      acc[status].count += 1; // Increment count
    
      return acc;
    }, {});

    const data3 = filtered.map((item) =>( {
  ...item.toObject(),
    projectName:item.projectName?.trim()
    }))
    
      res.status(200).json({ data:data3 });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;
