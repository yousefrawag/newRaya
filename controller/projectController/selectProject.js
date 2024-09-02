const projectSchema = require("../../model/projectSchema");
const selectProject = async (req, res, next) => {
  
  try {
   
    
    const allproject = await projectSchema.find({}).populate("addedBy");
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
 throw new Error(error)
    next(error);
  }
};
module.exports = selectProject;
