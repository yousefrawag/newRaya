const projectSchema = require("../../model/projectSchema");
const UinqDataProject = async (req, res, next) => {
  try {
  
    const projects = await projectSchema
      .find({}).populate("addedBy")

    
      const addedBy = [...new Set(projects.map((item) => item.addedBy))]

     
    res.status(200).json({projects  , addedBy });
  } catch (error) {
    next(error);
  }
};
module.exports = UinqDataProject;
