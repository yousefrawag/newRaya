const InstitutionsCompany =  require("../model/InstitutionsCompany")
const projectsSchema = require("../model/projectSchema")
const customerSchema = require("../model/customerSchema")
const userSchema = require("../model/userSchema");
exports.addNew = async (req , res , next ) => {
        const {name} = req.body
        if(name){
            const addnew = await InstitutionsCompany.create({...req.body})
           return res.status(200).json({mesg:"area add sucuufuly" , name:addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
}
exports.getAll = async (req , res , next) => {
    try {
            const allPayments = await InstitutionsCompany.find({}).sort({ createdAt: -1 })
            res.status(200).json({data:allPayments})
    } catch (error) {
        next(error)
    }
}
exports.Updateone = async (req , res , next) => {
        const {id} = req.params
        const {name} = req.body
        const updateNew = await InstitutionsCompany.findByIdAndUpdate(id , {
            ...req.body
        } , {new:true})
        res.status(200).json({mesg:"payemnts updated " , updateNew});
}
exports.Deleateone = async (req , res , next) => {
        const {id} = req.params
        const currentcurrency = await InstitutionsCompany.findById(id)
        if(currentcurrency) {
            await InstitutionsCompany.findByIdAndDelete(id)
          return  res.status(200).json({mesg:"currency deleted sucssfuly"});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}



exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. جلب المؤسسة
    const institution = await InstitutionsCompany.findById(id);
    if (!institution) {
      return res.status(404).json({ message: "المؤسسة غير موجودة" });
    }

    // 2. جلب المشاريع التابعة للمؤسسة (مع الحقول المطلوبة فقط)
    const projects = await projectsSchema
      .find({ InstitutionsCompany: institution._id })
      .select("_id projectName contrbuetType"); // نأخذ الحقول المطلوبة

    // 3. جلب مستخدمي المؤسسة (للحصول على أسمائهم)
    const institutionUsers = await userSchema
      .find({ institution: institution._id })
      .select("fullName");
    const userNames = institutionUsers.map((u) => u.fullName);

    // 4. جلب جميع العملاء الذين أضافهم هؤلاء المستخدمون (أي عملاء المؤسسة)
    const customers = await customerSchema
      .find({
        sourceType: "Institutions", // تأكد من أن العميل من نوع مؤسسات (اختياري)
        addBy: { $in: userNames }, // من أضافه مستخدم تابع للمؤسسة
      })
      .select("_id fullName phoneNumber project"); // اختر الحقول التي تريد عرضها

    // 5. إرجاع النتيجة
    return res.status(200).json({
      data: {
        institution: {
          _id: institution._id,
          name: institution.name,
          status:institution?.status
        },
        projects: projects.map((p) => ({
          _id: p._id,
          projectName: p.projectName,
          contributionType: p.contrbuetType || "غير محدد",
        })),
        customers: customers.map((c) => ({
          _id: c._id,
          fullName: c.fullName,
          phoneNumber: c.phoneNumber, // اختياري
          project: c.project, // المشروع الذي يهتم به العميل (إن وجد)
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};