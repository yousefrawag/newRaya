const PayvoucherSchema = require("../../model/paymentVoucher");

const AddpayVoucher = async (req, res, next) => {

  try {
    console.log(req.body)
    const PaymentVoucherData = {
   ...req.body,

    };

    const payementVoucher = await PayvoucherSchema.create(PaymentVoucherData);
    res.status(201).json({ message: "paymentVoucher created successfully", payementVoucher });
  } catch (error) {
next(error)
  }
};

module.exports = AddpayVoucher;
