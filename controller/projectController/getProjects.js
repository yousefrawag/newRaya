const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema")
const currencySchema = require("../../model/currency")
const getallProjects = async (req, res, next) => {
const {field , searTerm , startDate , endDate } = req.query
  
  try {
      const id = req.token.id
        const user = await userSchema.findById(id)
        let filterion 
        if(user.type === "admin") {
          filterion = {};
        }else{
          filterion = {addedBy: user?._id};
        }
    if (["projectName" ,"projectOwner" ,"projectOwnerPhone" , "estateType" , 
      "detailedAddress" , "governoate" , 
      "operationType" , "clientType" , 
      "areaMatter" , "spaceOuteside" ,
      "typeOfSpaceoutside","pymentType",
      "estatePrice", "materPriec",
      "projectSatatus" , "installments" ,
      "installmentsFirstPyment" , "InstallmentPeriod",
      "installmentsFirstPermonth",
      "projectNotes" , "projectads" , "projectDetails"


    ].includes(field) && searTerm) {
      filterion[field] = { $regex: new RegExp(searTerm, 'i') }
    }
  
 
    if (field === "addedBy" && searTerm) {
     const founduser = await userSchema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
     if(founduser.length){
      filterion[field]  = founduser[0]?._id
     }
    }
 if(field === "createdAt" && endDate){
  filterion[field] = {
    $gte: new Date(startDate),  // greater than or equal to fromDate
    $lte: new Date(endDate) 
  }
 }

  
    
    const allproject = await projectSchema.find(filterion).populate("addedBy").populate("locations").sort({ createdAt: -1 });
  
  
    
      res.status(200).json({ allproject });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;
