const customerSchema = require("../../model/customerSchema");
const addCustomer = async (req, res, next) => {
 if(req.file) {
  try {
    // Read and parse the Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Save parsed data to the database
    await customerSchema.insertMany(jsonData.map(item => ({
      ...item,
      addBy: req?.token?.id
    })));

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ message: 'Customers added successfully' });
  } catch (error) {
    return next(error);
  }

 }else {
  try {
    let customer = new customerSchema(req.body);
      customer.addBy = req?.token?.id
    await customer.save();
    return res
      .status(200)
      .json({ message: `${customer.clientStatus} created successfully`, customer });
  } catch (error) {
   
    next(error);
  }
 }

  

};

module.exports = addCustomer;
