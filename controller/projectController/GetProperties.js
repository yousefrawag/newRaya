const projectSchema = require("../../model/projectSchema");

const GetProperties = async (req, res, next) => {
  try {
    const projects = await projectSchema
      .find()
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