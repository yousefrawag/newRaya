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
  const getUser = async (UserName) => {

    const trimeName = UserName.trim()
    const findUser = await userSchema.findOne({fullName:trimeName}).exec()
    return findUser?  findUser._id : null}

  

    // Function to get the project ID based on the project name
    const getProjectId = async (projectName) => {
      const trimmedProjectName = projectName?.trim();
      console.log(trimmedProjectName);
      const project = await projectSchema.findOne({ projectName: trimmedProjectName }).exec();
      console.log(project);
      return project ? project._id : null;
    };

    // Prepare the customer data
    const vailData = await Promise.all(normalizedData.map(async (item) => {
      const projectId = await getProjectId(item.project?.trim());
      const userId = await getUser(item.addBy?.trim())
      return {
        fullName: item.fullName?.trim() || "",
        region: item.region.trim() || "",
        phoneNumber: item.phoneNumber || "",
        currency: item.currency || "",
        firstPayment: item.firstPayment || "",
        clientStatus: item.clientStatus || "عميل محتمل",
        project: projectId,
        notes: item.notes || "",
        clientRequire: item.clientRequire || "",
        clientendRequr: item.clientendRequr.trim() || "",
        addBy: userId,
        cashOption: item.cashOption.trim(),
        endContactDate: item.endContactDate,
        customerDate: item.customerDate || "",
        installmentsPyYear:item.installmentsPyYear
      };
    }));

    // Insert the customer data into the database
    const newCustomers = await customerSchema.insertMany(vailData);

    // Fetch the inserted customers and populate the fields
    const populatedCustomers = await customerSchema
      .find({ _id: { $in: newCustomers.map(customer => customer._id) } })
      .populate("addBy")
      .populate("project")
      .sort({ createdAt: -1 });

    res.status(200).json({ newCustomers: populatedCustomers });
  } catch (err) {
    console.error("bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
};

module.exports = insertMany;
