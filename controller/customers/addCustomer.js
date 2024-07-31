const customerSchema = require("../../model/customerSchema");
const addCustomer = async (req, res, next) => {
  try {
    const { fullName, email, governorate, phoneNumber, type, title, cardNumber } =
      req.body;
    const newClient = await customerSchema.create({
      fullName,
      email,
      governorate,
      phoneNumber,
      type,
      title,
      cardNumber,
    });
    return res
      .status(200)
      .json({ message: `${type} created successfully`, newClient });
  } catch (error) {
    next(error);
  }
};

module.exports = addCustomer;
