const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/customerSchema");
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    let customer = await customerSchema.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "This customer desn't exist" });
    }
  
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "customer updated successfully", updatedCustomer });
  } catch (error) {
    next(error);
  }
};

module.exports = updateCustomer;
