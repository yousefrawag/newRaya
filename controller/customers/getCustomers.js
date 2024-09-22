const customerSchema = require("../../model/customerSchema");
const projectschema = require("../../model/projectSchema")
const userSchema = require("../../model/userSchema")
const GetallCustomer = async (req, res, next) => {
  try {
    const { field, searchTerm } = req.query;
    let filters = {};

    if (field && searchTerm) {
      if (field === "fullName" || field === "region" || field === "currency" || field === "firstPayment" || field === "clientStatus" || field === "cashOption" || "installmentsPyYear") {
        filters[field] = { $regex: new RegExp(searchTerm, 'i') };
      } else if (field === "project") {
     const findProjectid = await projectschema.find({
          projectName: { $regex: new RegExp(searchTerm, 'i') }, // Case-insensitive regex
        })
       
        if (findProjectid.length > 0) {
          filters['project'] = findProjectid[0]._id; // Use ObjectId for project
          console.log(findProjectid[0]._id)
        } else {
          return res.status(404).json({ message: "Project not found" });
        }
      } else if (field === "addBy") {
        console.log(searchTerm)
        const findUserid = await userSchema.find({fullName:{ $regex: new RegExp(searchTerm, 'i') }})
        if (findUserid.length > 0) {
          filters["addBy"] = findUserid[0]._id;  // Use the numeric userId
          console.log(filters);  // Logs { addBy: 1 } (or whatever the userId is)
        }
     
      }
    }

    const Customers = await customerSchema.find(filters).populate("addBy").populate("project").sort({ createdAt: -1 });

    res.status(200).json({ Customers });
  } catch (error) {
    next(error);
  }
};

module.exports = GetallCustomer;