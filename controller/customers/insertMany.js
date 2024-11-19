const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema")

// Helper function to trim all the keys in an object
const trimObjectKeys = (obj) => {
  const trimmedObj = {};
  Object.keys(obj).forEach((key) => {
    trimmedObj[key.trim()] = obj[key]; // Trim the key and assign the value
  });
  return trimmedObj;
};

const insertMany = async (req, res) => {
  try {
    const jsonData = req.body;

    // Trim the keys of each item in jsonData
    const normalizedData = jsonData.map((item) => trimObjectKeys(item));
// find user who add customer
  

  



    // Prepare the customer data
    const vailData = await Promise.all(normalizedData.map(async (item) => {
 
      return {
        fullName: item.fullName || "",
        region: item.region || "",
        phoneNumber: item.phoneNumber || "",
        currency: item.currency || "",
        firstPayment: item.firstPayment || "",
        clientStatus: item.clientStatus || " ",
        project: item.project || "",
        isViwed:item.isViwed || "",
        notes: item.notes || "",
        clientRequire: item.clientRequire || "",
        clientendRequr: item.clientendRequr || "",
        addBy: item.addBy || "",
        cashOption: item.cashOption || "",
        endContactDate: item.endContactDate || "",
        customerDate: item.customerDate || "",
        installmentsPyYear:item.installmentsPyYear || "",
        secondaryPhoneNumber:item.secondaryPhoneNumber || "",
        createdAt:item.createdAt || ""
      };
    }));

    // Insert the customer data into the database
    const newCustomers = await customerSchema.insertMany(vailData);


    const populatedCustomers = await customerSchema
      .find({ _id: { $in: newCustomers.map(customer => customer._id) } })

      .sort({ createdAt: -1 });

    res.status(200).json({ newCustomers: populatedCustomers });
  } catch (err) {
    console.error("bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
};

module.exports = insertMany;
