const PrivetprojectSchema = require("../../model/privetProjectschema");
const getallProjects = async (req, res, next) => {
const { addedBy ,_id  } = req.query
  
  try {
    let filterion = {};
    if (_id) {
      filterion._id = decodeURIComponent(_id);
    }
    if (addedBy) {
      filterion.addedBy = decodeURIComponent(addedBy);
    }



    
    const allproject = await PrivetprojectSchema.find(filterion).populate("addedBy").sort({ createdAt: -1 });
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;