const projectSchema = require("../../model/projectSchema");
const addProject = async (req, res, next) => {
  try {
    const {
      estateType,
      governorate,
      city,
      estateNumber,
      specificEstate,
      clientType,
      estatePrice,
      operationType,
      installments,
      installmentsPerYear,
      areaMatter,
      finishingQuality,
    } = req.body;

    const newProject = await projectSchema.create({
      estateType,
      governorate,
      city,
      estateNumber,
      specificEstate,
      clientType,
      estatePrice,
      operationType,
      installments,
      installmentsPerYear,
      areaMatter,
      finishingQuality,
      addedBy: req.token.id,
    });
    res.status(200).json({ newProject });
  } catch (error) {
    next(error);
  }
};
module.exports = addProject;
