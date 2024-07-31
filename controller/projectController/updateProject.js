const projectSchema = require("../../model/projectSchema");
const updateProject = async (req, res) => {
  const { id } = req.body;
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
  try {
    const findProject = await projectSchema.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );
    res.json({ message: "project updated successfully", findProject });
  } catch (error) {
    next(error);
  }
};
module.exports = updateProject;
