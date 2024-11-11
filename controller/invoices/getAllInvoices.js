const invoiceSchema = require("../../model/invoiceSchema");
const getAllInvoices = async (req, res, next) => {
  try {
    const {field , searTerm , startDate  , endDate } = req.query
    let fillter = {}
    if(["SignatureBy" , "ThatFor" , "totalPrice" , "resivedfrom"].includes(field) && searTerm) {
      fillter[field] =  { $regex: new RegExp(searTerm, 'i') }
    }
    if(field === "createdAt" && endDate){
      fillter[field] =   {
        $gte: new Date(startDate),  // greater than or equal to fromDate
        $lte: new Date(endDate) 
      }
    }
    const invoices = await invoiceSchema
      .find(fillter)

      .sort({ createdAt: -1 })
    res.status(200).json({ invoices });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllInvoices;
