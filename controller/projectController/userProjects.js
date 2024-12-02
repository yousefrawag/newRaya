const projectSchema = require("../../model/projectSchema");

const userProjects = async (req, res) => {
  const { id } = req.params;
  const {field , searTerm , startDate , endDate } = req.query
  try {
    let filterion = { addedBy: id};
    if (["projectName" , "estateType" , 
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
      console.log(field);
      
      filterion[field] = {$regex: new RegExp(searTerm, 'i') }
    }
  
 
    if (field === "addedBy" && searTerm) {
     const founduser = await userSchema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
     if(founduser.length){
      filterion[field]  = {id:founduser[0]?._id}
     }
    }
 if(field === "createdAt" && endDate){
  filterion[field] = {
   
    $gte: new Date(startDate),  // greater than or equal to fromDate
    $lte: new Date(endDate) 
  }
 }
    const userProjects = await projectSchema.find(filterion).populate("addedBy").populate("locations").sort({ createdAt: -1 });
    res.status(200).json({ userProjects });
  } catch (error) {
    next(error);
  }
};
module.exports = userProjects;
