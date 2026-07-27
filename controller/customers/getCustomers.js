const customerSchema = require("../../model/customerSchema");
const projectschema = require("../../model/projectSchema")
const userSchema = require("../../model/userSchema")
const GetallCustomer = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
    const id = req.token.id
    const user = await userSchema.findById(id)
    const CurrentPermission = user?.role === 9
   let filters = {
      ArchievStatuts: { $in: [false, null] },
    
    };

    // بناء Regex لمطابقة اسم المستخدم الحالي في حقل addBy
    const nameRegex = new RegExp(`(^|\\s|\\/)+${user?.fullName.trim()}($|\\s|\\/)`, 'i');

    if (user.role === 9 || user.type === "admin") {
      // الأدمن: لا نضيف أي فلتر إضافي (يرى الكل)
      filters = {...filters ,   moduleType: { $in: ["customer", null] }}
    } 
    else if (user.type === "InstitutionsUser") {
      // 1. جلب أسماء المشاريع المسموح بها (لأن project مخزنة كنص)
      const allowedProjectIds = user.allowedProjects || [];
      let projectNames = [];
      if (allowedProjectIds.length > 0) {
        const projects = await projectschema.find(
          { _id: { $in: allowedProjectIds } },
          { projectName: 1 }
        );
        projectNames = projects.map(p => p.projectName);
      }

      // الشرط الأول: العملاء المشترك فيهم (addBy يحتوي على اسمه)
      const myCustomers = { addBy: { $regex: nameRegex } };

      // الشرط الثاني: العملاء التابعين لمشاريع مسموح بها (project يساوي اسم المشروع)
      const projectCustomers = projectNames.length > 0
        ? { project: { $in: projectNames } }
        : null;

      // دمج الشرطين بـ $or
      if (projectCustomers) {
        filters = { ...filters, $or: [myCustomers, projectCustomers] };
      } else {
        filters = { ...filters, ...myCustomers };
      }
    } 
    else {
      // الموظفون (employee) والمسوقون (brokker): فقط العملاء المشترك فيهم
      filters = { ...filters, addBy: { $regex: nameRegex } };
    }

   
   
    
    
const clients = await customerSchema.aggregate([
  {
    $match: {
      ...filters,
      ...(startDate && endDate && {
        SectionFollow: {
          $elemMatch: {
            detailsDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        }
      })
    }
  },
  {
    $addFields: {
      lastFollowUpdate: {
        $max: "$SectionFollow.createdAt"
      }
    }
  },
  { $sort: { lastFollowUpdate: -1 } },
  {
    $lookup: {
      from: "users",
      localField: "SectionFollow.user",
      foreignField: "_id",
      as: "SectionFollowUsers"
    }
  }
]);


 
      

    res.status(200).json({ data:clients });
  } catch (error) {
    next(error);
  }
};

module.exports = GetallCustomer;