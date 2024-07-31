const invoiceSchema = require("../../model/invoiceSchema");
const updateInvoices = async (req, res, next) => {
  const { id } = req.body;
  const { client, project, estateType, dueDate, status, total, notes } =
    req.body;
  try {
    const new_update = await invoiceSchema.findByIdAndUpdate(
      id,
      { client, project, estateType, dueDate, status, total, notes },
      { new: true }
    );
    if (!new_update) {
      res.status(404).json({ mesg: "thsi inovces not found in db" });
    }
    res
      .status(200)
      .json({ message: "invoice updated successfully", new_update });
  } catch (error) {
    next(error);
  }
};
module.exports = updateInvoices;
