const customerSchema = require("../../model/customerSchema");
const XLSX = require("xlsx");
const fs = require("fs");
const addCustomer = async (req, res, next) => {
  console.log("file")
  if (req.file) {
   
    try {
      // Ensure the file is an Excel file
      if (!req.file.mimetype.includes("spreadsheetml")) {
        throw new Error("Uploaded file is not an Excel file.");
      }

      // Read and parse the Excel file
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate the parsed data to match schema
      const validData = jsonData.map((item) => ({
        fullName: item.fullName,
        region: item.region,
        phoneNumber: item.phoneNumber,
        secondaryPhoneNumber: item.secondaryPhoneNumber || null,
        currency: item.currency,
        firstPayment: item.firstPayment,
        clientStatus: item.clientStatus,
        project: item.project,
        notes: item.notes,
        clientRequire: item.clientRequire,
        clientendRequr: item.clientendRequr,
        addBy: req?.token?.id,
      }));

      // Save valid data to the database
      await customerSchema.insertMany(validData);

      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(200).json({ message: "Customers added successfully" });
    } catch (error) {
      // Clean up file in case of error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      throw new Error(error)
      return next(error);
    }
  } else {
    try {
      // Save the single customer data from req.body
      let customer = new customerSchema(req.body);
      customer.addBy = req?.token?.id;
      await customer.save();
      return res.status(200).json({
        message: `${customer.clientStatus} created successfully`,
        customer,
      });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = addCustomer;
