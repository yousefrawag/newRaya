const customerSchema = require("../../model/ImportCustomers");
const userSchema = require("../../model/userSchema");

// دالة تحديد مستوى الصلاحية (نفس المنطق السابق)
// const determineDataLevel = (customer, currentUser) => {
//   const { sourceType, accses, addBy } = customer;
//   const { fullName, type, role } = currentUser;

//   if (role === 9 || type === "admin" || type === "employee" ||  type === "brokker" ) return "full";

//   // const nameRegex = new RegExp(`(^|\\s|\\/)+${fullName}($|\\s|\\/)`, "i");
//   // if (addBy && nameRegex.test(addBy)) return "full";

//   if (type === "InstitutionsUser" && sourceType === "Institutions") {
//       const access = accses || "limited";
//     return access === "full" ? "full" : "limited";
//   };

//   const rawSourceType = sourceType;
//   if (!rawSourceType || rawSourceType === "central") {
//     const access = accses || "limited";
//     return access === "full" ? "full" : "limited";
//   }

//   return "restricted";
// };

const CustomerOverview = async (req, res, next) => {
  try {
    // 1. جلب المستخدم الحالي
 

    // 2. جلب العميل
    const { id } = req.params;
    const customer = await customerSchema.findById(id).populate("SectionFollow.user").populate("addBy");
    if (!customer) {
      return res.status(404).json({ message: "Customer doesn't exist" });
    }

    // 3. ترتيب المتابعات (إن وجدت)
    if (customer.SectionFollow) {
      customer.SectionFollow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }





    return res.status(200).json({ data: customer });

  } catch (error) {
    next(error);
  }
};

module.exports = CustomerOverview;