const invoiceSchema = require("../../model/invoiceSchema");
const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceSchema
      .find({})
      .populate("client")
      .populate("project");
    res.status(200).json({ invoices });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllInvoices;
