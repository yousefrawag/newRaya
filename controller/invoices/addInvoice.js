const invoiceSchema = require("../../model/invoiceSchema");

const addInvoice = async (req, res, next) => {
  const { client, project, estateType, dueDate, status, total, notes } =
    req.body;

  try {
    const invoiceData = {
      client,
      project,
      estateType,
      dueDate,
      status,
      total,
    };
    if (notes !== undefined) {
      invoiceData.notes = notes;
    }
    const invoice = await invoiceSchema.create(invoiceData);
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = addInvoice;
