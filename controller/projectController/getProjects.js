const projectSchema = require("../../model/projectSchema");

const getallProjects = async (req, res, next) => {

  
  try {


  
    
    const data = await projectSchema.find({}).populate("customers").populate("section").populate("addedBy").sort({ createdAt: -1 });
  
  
    
      res.status(200).json({ data });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;
