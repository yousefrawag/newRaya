const PrivetprojectSchema = require("../../model/privetProjectschema");
const userSchema = require("../../model/userSchema")
const getallProjects = async (req, res, next) => {

  
  try {
   

    
    const data = await PrivetprojectSchema.find({}).populate("addedBy").sort({ createdAt: -1 });
  
  
    
      res.status(200).json({ data });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;