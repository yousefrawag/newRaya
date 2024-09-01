const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/customerSchema");
const deleteCustomer = async (req, res  , next) => {
  try {
    const { id } = req.params;
    await customerSchema.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteCustomer;
