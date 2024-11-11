const PayvoucherSchema = require("../../model/paymentVoucher");
const UpdatePaymentvoucher = async (req, res, next) => {
  const { id } = req.params;
 
  try {
    const new_update = await PayvoucherSchema.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!new_update) {
      res.status(404).json({ mesg: "thsi inovces not found in db" });
    }
    res
      .status(200)
      .json({ message: "paymentvoucher updated successfully", new_update });
  } catch (error) {
    next(error);
  }
};
module.exports = UpdatePaymentvoucher;
