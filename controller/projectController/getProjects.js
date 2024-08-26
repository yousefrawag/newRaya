const projectSchema = require("../../model/projectSchema");
const getallProjects = async (req, res, next) => {
  const {name} = req.query
  console.log(name);
  
  try {
  
  
      const allproject = await projectSchema.find({}).select("-addedBy");
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    next(error);
  }
};
module.exports = getallProjects;
