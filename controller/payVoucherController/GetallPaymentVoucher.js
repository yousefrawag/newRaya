const PayvoucherSchema = require("../../model/paymentVoucher");
const GetallPaymentVoucher = async (req, res, next) => {
  try {
    const {field , searTerm , startDate  , endDate } = req.query
    let fillter = {}
    if(["SignatureBy" , "ThatFor" , "totalPrice" , "payFor"].includes(field) && searTerm) {
      fillter[field] =  { $regex: new RegExp(searTerm, 'i') }
    }
    if(field === "createdAt" && endDate){
      fillter[field] =   {
        $gte: new Date(startDate),  // greater than or equal to fromDate
        $lte: new Date(endDate) 
      }
    }
    const PaymentVouchers = await PayvoucherSchema
      .find(fillter)

      .sort({ createdAt: -1 })
    res.status(200).json({ PaymentVouchers });
  } catch (error) {
    next(error);
  }
};
module.exports = GetallPaymentVoucher;
