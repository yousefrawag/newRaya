const customerSchema = require("../../model/customerSchema");
const updateCustomer = async (req, res, next) => {
  try {
    const {
      id,
      fullName,
      email,
      governorate,
      phoneNumber,
      type,
      title,
      cardNumber,
    } = req.body;
    const update = await customerSchema.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phoneNumber,
        type,
        title,
        governorate,
        cardNumber,
      },
      { new: true }
    );
    if (!update) {
      res.status(404).json({ message: "Customer desn't exist" });
    }
    res.status(200).json({ update });
  } catch (error) {
    next(error);
  }
};

module.exports = updateCustomer;
