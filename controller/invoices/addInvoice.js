const invoiceSchema = require("../../model/invoiceSchema");

const addInvoice = async (req, res, next) => {

  try {
    const invoiceData = {
   ...req.body,

    };

    const invoice = await invoiceSchema.create(invoiceData);
  return  res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = addInvoice;
