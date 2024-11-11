const invoiceSchema = require("../../model/invoiceSchema");
const getUnquedata = async (req, res, next) => {
  try {
  
    const invoices = await invoiceSchema
      .find({})
      
      const clients = [...new Set(invoices.map((item) => item.client))]
      const project = [...new Set(invoices.map((item) => item.project))]
    res.status(200).json({clients  ,  project });
  } catch (error) {
    next(error);
  }
};
module.exports = getUnquedata;
