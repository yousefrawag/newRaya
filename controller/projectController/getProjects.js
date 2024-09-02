const projectSchema = require("../../model/projectSchema");
const getallProjects = async (req, res, next) => {
const {opertaionType , addedBy ,estateType } = req.query
  
  try {
    let filterion = {};
    if (opertaionType) {
      filterion.opertaionType = decodeURIComponent(opertaionType);
    }
    if (addedBy) {
      filterion.addedBy = decodeURIComponent(addedBy);
    }
    if (estateType) {
      filterion.estateType = decodeURIComponent(estateType);
    }

    console.log(filterion);
    
    const allproject = await projectSchema.find(filterion).populate("addedBy");
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    throw new Error(errro)
    next(error);
  }
};
module.exports = getallProjects;
