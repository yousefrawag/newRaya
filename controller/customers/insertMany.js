const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");

const insertMany = async (req, res) => {
  try {
    const jsonData = req.body;

    // Function to get the project ID based on the project name
    const getProjectId = async (projectName) => {
      const trimmedProjectName = projectName.trim();
      console.log(trimmedProjectName);
      const project = await projectSchema.findOne({ projectName:trimmedProjectName}).exec();
      console.log(project)
      return project ? project._id : null;
    };

    // Prepare the customer data
    const vailData = await Promise.all(jsonData.map(async (item) => {
      const projectId = await getProjectId(item.project);
      return {
        fullName: item.fullName || "",
        region: item.region || "",
        phoneNumber: item.phoneNumber || "",
        secondaryPhoneNumber: item.secondaryPhoneNumber || "",
        currency: item.currency || "",
        firstPayment: item.firstPayment || "",
        clientStatus: item.clientStatus || "New",
        project: projectId,
        notes: item.notes || "",
        clientRequire: item.clientRequire || "",
        clientendRequr: item.clientEndRequr || "",
        addBy: req.token.id
      };
    }));

    // Insert the customer data into the database
    const newCustomers = await customerSchema.insertMany(vailData);

    // Fetch the inserted customers and populate the fields
    const populatedCustomers = await customerSchema
      .find({ _id: { $in: newCustomers.map(customer => customer._id) } })
      .populate("addBy")
      .populate("project");

    res.status(200).json({ newCustomers: populatedCustomers });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
};

module.exports = insertMany;
