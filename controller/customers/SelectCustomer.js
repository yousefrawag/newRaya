const customerSchema = require("../../model/customerSchema");
const SelectCustomer = async (req, res, next) => {
  try {
    const Customers = await customerSchema.find({}).populate("addBy").populate("project");
    res.status(200).json({ Customers });
  } catch (error) {
    next(error);
  }
};
module.exports = SelectCustomer;