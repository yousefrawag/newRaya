const PrivetprojectSchema = require("../../model/privetProjectschema");
const userSchema = require("../../model/userSchema")
const getallProjects = async (req, res, next) => {
const { field , searTerm  , startDate , endDate  } = req.query
  
  try {
    let filterion = {};
    if (["projectName" , "projectDetails" , "projectNotes"].includes(field) && searTerm) {
      filterion[field] =  { $regex: new RegExp(searTerm, 'i') }
    }
    if (field === "addedBy" && searTerm) {
      const founduser = await userSchema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
      if(founduser && founduser.length){
        filterion[field] = founduser[0]?._id
      }
    }

    if(["createdAt"].includes(field) && endDate){
      filter[field] = {
        $gte: new Date(startDate),  // greater than or equal to fromDate
        $lte: new Date(endDate) 
      }
    }

    
    const allproject = await PrivetprojectSchema.find(filterion).populate("addedBy").sort({ createdAt: -1 });
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;