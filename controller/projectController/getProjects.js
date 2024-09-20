const projectSchema = require("../../model/projectSchema");
const getallProjects = async (req, res, next) => {
const {opertaionType , addedBy ,_id  , projectSatatus} = req.query
  
  try {
    let filterion = {};
    if (_id) {
      filterion._id = decodeURIComponent(_id);
    }
    if (addedBy) {
      filterion.addedBy = decodeURIComponent(addedBy);
    }
    if (opertaionType) {
      filterion.opertaionType = decodeURIComponent(opertaionType);
    }
    if (projectSatatus) {
      filterion.projectSatatus = decodeURIComponent(projectSatatus);
    }

    console.log(filterion);
    
    const allproject = await projectSchema.find(filterion).populate("addedBy");
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;
