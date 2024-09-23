const PrivetprojectSchema = require("../../model/privetProjectschema");
const selectprivetproject = async (req, res, next) => {
  
  try {
   
    
    const allproject = await PrivetprojectSchema.find({}).populate("addedBy");
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
 throw new Error(error)
    next(error);
  }
};
module.exports = selectprivetproject;