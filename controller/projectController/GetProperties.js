const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema")

const GetProperties = async (req, res, next) => {
  try {
      const id = req.token.id
        const user = await userSchema.findById(id)
        const userId = req.token.id;
let filter ;
   const isAdmin = user.role === 9 || user.type === "admin";
    const isEmployee = user.type === "employee";
    const isInstitutionsUser = user.type === "InstitutionsUser";
    const isBroker = user?.type === "brokker"


    if (isAdmin || isEmployee) {
      // ✅ الأدمن والموظف يشاهدون كل المشاريع
      filter = {};
    } 
    else if (isInstitutionsUser || isBroker) {
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
        filter = { $or: orConditions };
      } else {
        // لا توجد شروط → لا يرى أي مشروع
        filter = { _id: { $in: [] } }; // شرط مستحيل التحقق
      }
    } 
    else {
      // أي نوع مستخدم آخر → لا يرى شيئاً
      filter = { _id: { $in: [] } };
    }

    const projects = await projectSchema
      .find(filter)
      .populate({
        path: 'properties.customers',
        select: 'fullName _id'
      });

    const allProperties = projects.flatMap((project) => {
      if (!project.properties || project.properties.length === 0) {
        return [];
      }

      return project.properties.map((property) => {
        const propertyObj = property.toObject?.() || property;
        
        const customers = propertyObj.customers?.map(customer => ({
          id: customer._id,
          fullName: customer.fullName
        })) || [];

        return {
          ...propertyObj,
          customers: customers,
          projectId: project._id,
          projectName: project.projectName,
          projectStatus: project.projectStatus,
          governorate: project.governorate,
          city: project.city,
          detailedAddress: project.detailedAddress,
        };
      });
    });

    // ✅ ترتيب الشقق حسب تاريخ الإنشاء (الأحدث أولاً)
    const sortedProperties = allProperties.sort((a, b) => {
      // لو عندك createdAt في الـ property
      return new Date(b.createdAt) - new Date(a.createdAt);
      
      // أو لو عايز ترتب حسب الـ _id (لو بيتضمن الوقت)
      // return b._id.toString().localeCompare(a._id.toString());
    });

    res.status(200).json({
      count: sortedProperties.length,
      data: sortedProperties
    });

  } catch (error) {
    next(error);
  }
};

module.exports = GetProperties;