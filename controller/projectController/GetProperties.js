const projectSchema = require("../../model/projectSchema");
const GetProperties = async (req, res, next) => {
  try {

    const projects = await projectSchema
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'properties.customers',
        select: 'fullName _id' // جلب فقط fullName و _id
      })
      ;  

const allProperties = projects.flatMap((project) => {
  if (!project.properties || project.properties.length === 0) {
    return [];
  }

  return project.properties.map((property) => {
    const propertyObj = property.toObject?.() || property;
    
    // تحويل بيانات العملاء إلى صيغة مبسطة
    const customers = propertyObj.customers?.map(customer => ({
      id: customer._id,
      fullName: customer.fullName
    })) || [];

    return {
      ...propertyObj,
      customers: customers, // استبدال بيانات العملاء بالصيغة المبسطة
      projectId: project._id,
      projectName: project.projectName,
      projectStatus: project.projectStatus,
      governorate: project.governorate,
      city: project.city,
      detailedAddress: project.detailedAddress,
    };
  });
});


    res.status(200).json({
      count: allProperties.length,
      data: allProperties
    });

  } catch (error) {
    next(error);
  }
};

module.exports = GetProperties;