const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema")
const getUserCustomer = async (req, res , next) => {
  try {
    const { id } = req.params;
  

    const founduser = await userSchema.findById(id)
    
  
    const data = await customerSchema.find({addBy:id})
    if (!data) {
     return res.status(404).json({ message: "Customer desn't exist" });
    }
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserCustomer;
