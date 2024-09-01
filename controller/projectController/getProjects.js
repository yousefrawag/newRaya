const projectSchema = require("../../model/projectSchema");
const getallProjects = async (req, res, next) => {
  console.log(req.query);
  
  try {
  
  
      const allproject = await projectSchema.find({}).populate("addedBy");
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    next(error);
  }
};
module.exports = getallProjects;
