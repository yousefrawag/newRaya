const invoiceSchema = require("../../model/invoiceSchema");

const getInvoiceAndMissionDates = async (req, res, next) => {
  try {
    const now = new Date();

    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const invoices = await invoiceSchema.find({
      dueDate: {
        $gte: now.toISOString(), 
        $lte: oneMonthFromNow.toISOString(), 
      },
    });
    const missions = await invoiceSchema.find({
      deadline: {
        $gte: now.toISOString(), 
        $lte: oneMonthFromNow.toISOString(), 
      },
    });

    res.status(200).json({ invoices, missions });
  } catch (error) {
    next(error);
  }
};

module.exports = getInvoiceAndMissionDates;
