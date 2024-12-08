const PayvoucherSchema = require("../../model/paymentVoucher");
const SinagelPyemntVoucher = async (req, res, next) => {
  const { id } = req.params;
  try {
    const paymentsVouchers = await PayvoucherSchema
      .findById(id)
   
    if (!paymentsVouchers) {
    return  res.status(404).json({ message: "payemntVoucher doesn't exist" });
    }
    res.status(200).json({ paymentsVouchers });
  } catch (error) {
next(error)
  }
};
module.exports = SinagelPyemntVoucher;
