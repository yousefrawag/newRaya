const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");

// دالة تحديد مستوى الصلاحية (نفس المنطق السابق)
const determineDataLevel = (customer, currentUser) => {
  const { sourceType, accses, addBy } = customer;
  const { fullName, type, role } = currentUser;

  if (role === 9 || type === "admin" || type === "employee" ||  type === "brokker" ) return "full";

  // const nameRegex = new RegExp(`(^|\\s|\\/)+${fullName}($|\\s|\\/)`, "i");
  // if (addBy && nameRegex.test(addBy)) return "full";

  if (type === "InstitutionsUser" && sourceType === "Institutions") {
      const access = accses || "limited";
    return access === "full" ? "full" : "limited";
  };

  const rawSourceType = sourceType;
  if (!rawSourceType || rawSourceType === "central") {
    const access = accses || "limited";
    return access === "full" ? "full" : "limited";
  }

  return "restricted";
};

const getCustomerByID = async (req, res, next) => {
  try {
    // 1. جلب المستخدم الحالي
    if (!req.token || !req.token.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const currentUser = await userSchema.findById(req.token.id).select("fullName type role");
    if (!currentUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // 2. جلب العميل
    const { id } = req.params;
    const customer = await customerSchema.findById(id).populate("SectionFollow.user");
    if (!customer) {
      return res.status(404).json({ message: "Customer doesn't exist" });
    }

    // 3. ترتيب المتابعات (إن وجدت)
    if (customer.SectionFollow) {
      customer.SectionFollow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 4. تحديد مستوى الصلاحية
    const dataLevel = determineDataLevel(customer, currentUser);
    const customerObj = customer.toObject ? customer.toObject() : customer;

    // 5. تصفية البيانات حسب المستوى
    let filteredData;

    if (dataLevel === "restricted") {
      // الحقول العامة فقط
      const { _id, fullName, project, clientStatus, region, sourceType, dataLevel, createdAt } = customerObj;
      filteredData = { _id, fullName, project, clientStatus, region, sourceType, dataLevel, createdAt };
    } 
    else if (dataLevel === "limited") {
      // ✅ الحقول المسموحة فقط: الاسم، المشروع، المسوق، آخر تواصل
      const { _id, fullName, project, addBy, lastFollowUpdate, SectionFollow } = customerObj;

      // استخراج تاريخ آخر متابعة (إن وجد)
      let lastContactDate = null;
      if (SectionFollow && SectionFollow.length > 0) {
        // SectionFollow مرتب بالفعل ترتيب تنازلي (بسبب الترتيب أعلاه)
        const latestFollow = SectionFollow[0];
        lastContactDate = latestFollow.createdAt || latestFollow.detailsDate;
      }
      // إذا كان هناك حقل lastFollowUpdate منفصل، استخدمه
      const lastContact = lastFollowUpdate || lastContactDate;

      filteredData = {
        _id,
        fullName,
        project,
        addBy,
        dataLevel,
        lastContact, // تاريخ آخر تواصل (أو null)
      };
    } 
    else { // full
      filteredData = customerObj;
      filteredData.dataLevel = dataLevel;
    }

    return res.status(200).json({ data: filteredData });

  } catch (error) {
    next(error);
  }
};

module.exports = getCustomerByID;