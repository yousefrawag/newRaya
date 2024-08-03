const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/customerSchema");
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    let customer = await customerSchema.findByIdAndDelete(id);
    await cloudinary.delete(customer.imageID);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteCustomer;
