const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema")
const getUserCustomer = async (req, res , next) => {
  try {
    const { id } = req.params;
    const { field, searTerm , startDate , endDate } = req.query;

    const founduser = await userSchema.findById(id)
    
    let filters = {addBy: founduser.fullName.trim()};
   
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


    if(["createdAt" , "endContactDate" , "customerDate"].includes(field) && endDate){
      filters[field] = {
        $gte: new Date(startDate),  // greater than or equal to fromDate
        $lte: new Date(endDate) 
      }
    }
    const customer = await customerSchema.find(filters)
    if (!customer) {
      res.status(404).json({ message: "Customer desn't exist" });
    }
    res.status(200).json({ customer });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserCustomer;
