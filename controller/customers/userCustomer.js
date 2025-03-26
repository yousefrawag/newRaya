const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema")
const getUserCustomer = async (req, res, next) => {
  try {
    console.log("Token ID:", req.token.id);
    
    const founduser = await userSchema.findById(req.token.id).lean();
    if (!founduser) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Info:", founduser);

    let filters = { addBy: founduser.fullName.trim() };
    const data = await customerSchema.find(filters);

    if (!data.length) {
      return res.status(404).json({ message: "Customer doesn't exist" });
    }

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};


module.exports = getUserCustomer;
