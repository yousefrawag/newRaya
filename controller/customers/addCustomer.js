const customerSchema = require("../../model/customerSchema");
const addCustomer = async (req, res, next) => {

    try {
      // Save the single customer data from req.body
      const {phoneNumber} = req.body
      const founduser = await customerSchema.findOne({phoneNumber})
      if(founduser) {
        console.log(founduser);
        
        return res.status(404).json({mesg:"userfound"})
      }
      let customer = new customerSchema(req.body);


      await customer.save();
      return res.status(200).json({
        message: `${customer.clientStatus} created successfully`,
        customer,
      });
    } catch (error) {
      throw new Error(error)
    }
  
};

module.exports = addCustomer;
