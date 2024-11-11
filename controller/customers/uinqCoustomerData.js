const customerSchema = require("../../model/customerSchema");
const uinqCoustomerData = async (req, res, next) => {
  try {
    
    const Customers = await customerSchema.find({})
    const projects = [...new Set(Customers.map(custom => custom.project))]
    const addBy = [...new Set(Customers.map(custom => custom.addBy))]
    
    res.status(200).json({ projects , addBy , Customers });
  } catch (error) {
    next(error);
  }
};
module.exports = uinqCoustomerData;
