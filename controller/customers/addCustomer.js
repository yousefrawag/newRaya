const customerSchema = require("../../model/customerSchema");
const addCustomer = async (req, res, next) => {

    try {
      // Save the single customer data from req.body
      let customer = new customerSchema(req.body);

      await customer.save();
      return res.status(200).json({
        message: `${customer.clientStatus} created successfully`,
        customer,
      });
    } catch (error) {
      return next(error);
    }
  
};

module.exports = addCustomer;
