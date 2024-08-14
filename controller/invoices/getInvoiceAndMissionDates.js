const invoiceSchema = require("../../model/invoiceSchema");
const missionSchema = require("../../model/missionSchema");

const getInvoiceAndMissionDates = async (req, res, next) => {
  try {
    const now = new Date();

    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const invoices = await invoiceSchema
      .find({
        dueDate: {
          $gte: now.toISOString(),
          $lte: oneMonthFromNow.toISOString(),
        },
      })
      .populate(["client", "project"]);
    const missions = await missionSchema
      .find({
        deadline: {
          $gte: now.toISOString(),
          $lte: oneMonthFromNow.toISOString(),
        },
      })
      .populate(["assignedTo", "assignedBy", "project"]);

    res.status(200).json({ invoices, missions });
  } catch (error) {
    next(error);
  }
};

module.exports = getInvoiceAndMissionDates;
