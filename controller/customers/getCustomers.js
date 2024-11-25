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