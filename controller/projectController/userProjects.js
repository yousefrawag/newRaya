const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");

const userProjects = async (req, res, next) => {
  const  id  = req.token.id;

  try {
    const user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    let filterion = {};

    // 1. بروكر: يشوف كل المشاريع
    if (user.type === "brokker") {
      filterion = {};
    } 
    // 2. مستخدم مؤسسة: يشوف المسموح له بها + التي أضافها
    else if (user.type === "InstitutionsUser") {
      const orConditions = [{ addedBy: id }];
      if (user.allowedProjects && user.allowedProjects.length > 0) {
        orConditions.push({ _id: { $in: user.allowedProjects } });
      }
      filterion = { $or: orConditions };
    } 
    // 3. أي مستخدم آخر (موظف، أدمن، إلخ): يشوف كل المشاريع أيضاً
    else {
      filterion = {};
    }

    const userProjects = await projectSchema
      .find(filterion)
      .populate("addedBy")
      .populate("InstitutionsCompany")
      .sort({ createdAt: -1 });

    res.status(200).json({data: userProjects });
  } catch (error) {
    next(error);
  }
};

module.exports = userProjects;