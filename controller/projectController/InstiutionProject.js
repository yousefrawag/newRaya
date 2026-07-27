const projectSchema = require("../../model/projectSchema");

const InstiutionProject = async (req, res) => {
  const { id } = req.params;

  try {

  
 


    const InstitutionsCompanyProjects = await projectSchema.find({InstitutionsCompany:id}).populate("addedBy").populate("InstitutionsCompany").sort({ createdAt: -1 });
    res.status(200).json({data:InstitutionsCompanyProjects });
  } catch (error) {
    next(error);
  }
};
module.exports = InstiutionProject;
