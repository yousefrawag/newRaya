const customerSchema = require("../../model/customerSchema");
const projectschema = require("../../model/projectSchema")
const userSchema = require("../../model/userSchema")
const GetallCustomer = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
    let filters = {};
   
      if (
        ["fullName" , "region" , "currency" , 
          "firstPayment" , "clientStatus" , 
          "cashOption" , "installmentsPyYear" , 
          "isViwed" ,"notes","phoneNumber",
          "project", "addBy",
           "clientendRequr" , "clientRequire"].includes(field) && searTerm
      
      ) {
        filters[field] = { $regex: new RegExp(searTerm, 'i') };
      } 

    //   if (field === "project") {
    //  const findProjectid = await projectschema.find({
    //       projectName: { $regex: new RegExp(searTerm, 'i') }, // Case-insensitive regex
    //     })
       
    //     if (findProjectid.length > 0) {
    //       filters['project'] = findProjectid[0]._id; // Use ObjectId for project
    //       console.log(findProjectid[0]._id)
    //     } else {
    //       return res.status(404).json({ message: "Project not found" });
    //     }
    //   } 
    //   if (field === "addBy") {
       
    //     const findUserid = await userSchema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
    //     if (findUserid.length > 0) {
    //       filters["addBy"] = findUserid[0]._id;  // Use the numeric userId
    //       console.log(filters);  // Logs { addBy: 1 } (or whatever the userId is)
    //     }
     
    //   }

      if(["createdAt" , "endContactDate" , "customerDate"].includes(field) && endDate){
        filters[field] = {
          $gte: new Date(startDate),  // greater than or equal to fromDate
          $lte: new Date(endDate) 
        }
      }
    

    const Customers = await customerSchema.find(filters).sort({ createdAt: -1 });

    res.status(200).json({ Customers });
  } catch (error) {
    next(error);
  }
};

module.exports = GetallCustomer;