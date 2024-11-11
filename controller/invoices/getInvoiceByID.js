const invoiceSchema = require("../../model/invoiceSchema");
const getInvoiceByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const invoice = await invoiceSchema
      .findById(id)
   
    if (!invoice) {
      res.status(404).json({ message: "invoice doesn't exist" });
    }
    res.status(200).json({ invoice });
  } catch (error) {
    next(error);
  }
};
module.exports = getInvoiceByID;
