const PayvoucherSchema = require("../../model/paymentVoucher");
const DeletePaymentVoucher = async (req, res, next) => {
  const { id } = req.params;
  try {
    const payemntvoucher = await PayvoucherSchema.findByIdAndDelete(id);
    if (!payemntvoucher) {
     return res.status(404).json({ message: "paymentvoucher doesn't exist" });
    }
    res.status(200).json({ message: "paymentvoucher deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = DeletePaymentVoucher;
